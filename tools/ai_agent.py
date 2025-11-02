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

    for f in ["src/api","pages/api","src/components","src/hooks","src/lib","scripts"]:
        if os.path.exists(f): out[f]=sh(f"ls -R {f} || true").stdout

    return out


def ask_model(context_text):
    key = os.getenv("DEEPSEEK_API_KEY")

    # اگر کلید نبود → فقط حالت آفلاین
    if not key or not HAS_DEEPSEEK:
        print("⚠️  No DEEPSEEK_API_KEY — running in OFFLINE mode.")
        return "No suggested fixes."

    client = Deepseek(api_key=key)

    GOAL = """
Fix failing payment on Base mainnet that causes MetaMask to show
'likely to fail' / 'transaction was canceled'. Patch frontend to
simulate first, only then send; verify chainId=8453; and handle receipt.

Scope:
- Find ETH payment code (e.g. useETHPayment, PaymentButton, wallet send).
- Replace direct write/send with viem simulate+write pattern.
- Ensure correct network (Base mainnet 8453) and target contract.
- If contract call: use proper ABI and args; if pure transfer: use sendTransaction.
- Pass value with parseEther(), not raw floats.
- Add gas estimation via publicClient.estimate* or simulateContract.
- On revert in simulation: show UI error and DO NOT open MetaMask.
- After write, waitForTransactionReceipt() and return txHash to /api/createproof1.

Concrete changes:

1) Add utils/viem.ts
   - export publicClient (ALCHEMY_BASE_RPC), walletClient, chain=base.

2) Update payment code (look for 'PaymentButton' or 'useETHPayment'):
   - if calling a contract:
       const sim = await publicClient.simulateContract({ address, abi, functionName, args, value, account });
       const hash = await walletClient.writeContract(sim.request);
     else (simple transfer):
       const hash = await walletClient.sendTransaction({ account, to: TARGET_ADDRESS, value, chain: base });
   - await publicClient.waitForTransactionReceipt({ hash });
   - call fetch('/api/createproof1', { method:'POST', body: JSON.stringify({ transactionHash: hash, userAddress, amount }) })

3) Enforce Base:
   - If window.ethereum chainId !== 0x2105, prompt switch; block otherwise.

4) Env:
   - read ALCHEMY_BASE_RPC from process.env (required). If missing, show UI error.

5) Logs/UI:
   - 'simulate ok', 'write sent: <hash>', 'receipt status: success/failed', and proper user-facing error.

6) Tests:
   - In dev, clicking 'Create Proof' must:
     a) NOT open MetaMask if simulation fails (show message containing 'Simulation failed').
     b) On success, POST /api/createproof1 returns 200 and Supabase gets a row.

Return ONLY a unified diff (git apply compatible). No prose.
"""

    prompt = GOAL + "\n\nProject context:\n" + str(context_text)

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