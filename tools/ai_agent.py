import os
import subprocess
import tempfile
from github import Github
from git import Repo

# =======================
#  Deepseek Client (اختیاری)
# =======================
HAS_DEEPSEEK = True
try:
    from deepseek import Deepseek
except:
    HAS_DEEPSEEK = False


def sh(cmd):
    print(">", cmd)
    p = subprocess.run(cmd, shell=True, text=True, capture_output=True)
    print(p.stdout)
    if p.returncode != 0:
        print(p.stderr)
    return p


def gather_context():
    out = {}
    # لاگ تست‌ها اگر باشد
    if os.path.exists("package.json"):
        out["npm_test"] = sh("npm test --silent || true").stdout

    # ساختار فولدر
    out["src_structure"] = sh("ls -R || true").stdout
    return out


def ask_model(context_text):
    key = os.getenv("DEEPSEEK_API_KEY")

    # اگر کلید نبود → فقط حالت آفلاین
    if not key or not HAS_DEEPSEEK:
        print("⚠️  No DEEPSEEK_API_KEY — running in OFFLINE mode.")
        return "No suggested fixes."

    client = Deepseek(api_key=key)

    prompt = """
Fix Create Proof submission flow on Base Mainnet.
Goals:
1) After wallet signs and sends transaction, extract the txHash.
2) Wait for receipt (confirm mined) on Base Mainnet (chainId 8453).
3) Call POST /api/createproof { wallet, txHash, payload }.
4) Insert into Supabase using service role key.
5) Return ONLY unified diff (diff --git ...) minimal and safe.
Do NOT modify unrelated files.
Project context:
""" + str(context_text)

    resp = client.chat.completions.create(
        model="deepseek-chat",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.25,
    )

    return resp.choices[0].message.content


def apply_patch(full_text):
    lines = full_text.splitlines()
    summary = lines[0][:60] if lines else "AI auto fix"

    # فقط خطوط patch را جدا کنیم
    diff = "\n".join(
        l for l in lines
        if l.startswith("diff ") or l.startswith("--- ") or l.startswith("+++ ") or l.startswith("@@") or l.startswith("+") or l.startswith("-") or l == ""
    )

    if not diff.strip():
        print("ℹ️  No actual diff generated — nothing to apply.")
        return

    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".patch")
    tmp.write(diff.encode())
    tmp.close()

    sh("git config user.name 'ai-agent'")
    sh("git config user.email 'ai@users.noreply.github.com'")

    sh("git checkout -B main")
    branch = "ai-fix-" + summary.replace(" ", "-")[:35]
    sh(f"git checkout -b {branch}")
    sh(f"git apply --whitespace=fix {tmp.name}")
    sh("git add -A")
    sh(f"git commit -m 'AI: {summary}'")
    sh(f"git push -u origin {branch}")

    gh = Github(os.getenv("GITHUB_TOKEN"))
    repo = gh.get_repo(os.getenv("GITHUB_REPOSITORY"))
    pr = repo.create_pull(title=f"AI: {summary}", body=full_text, head=branch, base="main")
    print("✅ Pull Request Created:", pr.html_url)


def main():
    ctx = gather_context()
    result = ask_model(str(ctx))
    apply_patch(result)


if __name__ == "__main__":
    main()