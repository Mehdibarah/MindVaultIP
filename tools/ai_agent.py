import os, subprocess, tempfile
from github import Github
from git import Repo
import openai

BASE_BRANCH = os.environ.get("BASE_BRANCH", "main")
BRANCH_PREFIX = "ai-fix/"

def sh(cmd):
  print(">", cmd)
  p = subprocess.run(cmd, shell=True, text=True, capture_output=True)
  print(p.stdout)
  if p.returncode != 0: print(p.stderr)
  return p

def gather():
  out = {}
  out["npm_test"] = sh("npm test --silent || true").stdout if os.path.exists("package.json") else ""
  out["console_notes"] = "Resolve 404 __nonexistent__.txt noise; ensure API calls use absolute paths like /api/<name> and not mainnet.base.org."
  # فایل‌های کلیدی برای کانتکست
  for f in ["package.json", "next.config.js", "vite.config.ts", "app/api", "pages/api"]:
    if os.path.exists(f):
      out[f] = sh(f"ls -R {f} || true").stdout
  return out

def ask_llm(ctx):
  system = "You are a senior full-stack engineer. Generate a minimal, safe unified diff to fix issues."
  user = f"""
Context (test/logs/listings):
{ctx}

Goals:
1) حذف 404 مربوط به '__nonexistent__.txt' (یا ایجاد فایل در public/ یا شرطی کردن در dev).
2) اگر فریم‌ورک Next/Vite است، هر فراخوانی endpoint را به مسیر درست '/api/<name>' یا URL مطلق اصلاح کن؛ از ارسال درخواست به mainnet.base.org جلوگیری کن.
3) اگر api route وجود ندارد، برای Next.js بساز:
   - app/api/<name>/route.ts با تابع POST
   - یا pages/api/<name>.ts
4) در صورت استفاده از Supabase، از supabase.functions.invoke('<function>') استفاده کن.
5) تست‌های npm را تا جایی که می‌شود سبز کن (بدون تغییرات خطرناک).

Return:
- First line a short summary.
- Then ONLY a unified diff (diff --git ...) that can be applied with 'git apply'.
"""
  resp = openai.ChatCompletion.create(
      model="gpt-4o-mini",
      messages=[{"role":"system","content":system},
                {"role":"user","content":user}],
      temperature=0.2, max_tokens=1400)
  return resp["choices"][0]["message"]["content"]

def apply_and_pr(diff_with_summary):
  lines = diff_with_summary.splitlines()
  summary = lines[0][:200] if lines else "AI automated fix"
  diff = "\n".join([l for l in lines if l.startswith("diff ") or l.startswith("--- ") or l.startswith("+++ ") or l.startswith("@@") or l.startswith("+") or l.startswith("-") or l=="" ])
  if not diff.strip():
    print("No diff generated"); return
  tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".patch"); tmp.write(diff.encode()); tmp.close()
  sh("git config user.name 'ai-agent' && git config user.email 'ai@users.noreply.github.com'")
  sh(f"git checkout -B {BASE_BRANCH}")
  branch = BRANCH_PREFIX + summary.replace(" ", "-")[:40]
  sh(f"git checkout -b {branch}")
  if sh(f"git apply --whitespace=fix {tmp.name}").returncode != 0:
    print("Patch apply failed"); return
  sh("git add -A")
  sh(f"git commit -m 'AI: {summary}' || true")
  sh(f"git push -u origin {branch}")
  gh = Github(os.environ["GITHUB_TOKEN"])
  repo = gh.get_repo(os.environ["GITHUB_REPOSITORY"])
  pr = repo.create_pull(title=f"AI: {summary}", body=diff_with_summary, head=branch, base=BASE_BRANCH)
  print("PR:", pr.html_url)

def main():
  assert os.getenv("OPENAI_API_KEY"), "OPENAI_API_KEY missing"
  assert os.getenv("GITHUB_TOKEN"), "GITHUB_TOKEN missing"
  ctx = gather()
  content = ask_llm(ctx)
  apply_and_pr(content)

if __name__ == "__main__":
  main()