#!/bin/bash

# 🔧 اسکریپت خودکار برای پیدا کردن و اصلاح مشکل createproof1

echo "🔍 جستجوی فایل‌های مشکل‌دار..."
echo ""

# رنگ‌ها
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# پیدا کردن فایل‌های مشکل‌دار
echo "${BLUE}📂 جستجو در پوشه src/...${NC}"
FILES=$(find ./src -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \) 2>/dev/null)

if [ -z "$FILES" ]; then
    echo "${YELLOW}⚠️  پوشه src/ پیدا نشد. جستجو در پوشه جاری...${NC}"
    FILES=$(find . -maxdepth 3 -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \) \
            ! -path "*/node_modules/*" ! -path "*/.next/*" ! -path "*/dist/*" ! -path "*/.git/*" 2>/dev/null)
fi

FOUND=0
FIXED=0
BACKUP_DIR="./backups-$(date +%Y%m%d-%H%M%S)"

# ساخت پوشه backup
mkdir -p "$BACKUP_DIR"

for file in $FILES; do
    # چک کردن اگه فایل شامل createproof هست (با fetch یا axios)
    if grep -qE "(fetch|axios|postJson|get|post).*createproof" "$file" 2>/dev/null; then
        echo ""
        echo "${GREEN}✓ فایل پیدا شد:${NC} $file"
        
        # نمایش خطوط مشکل‌دار
        echo "${YELLOW}خطوط مشکل‌دار:${NC}"
        grep -nE "(fetch|axios|postJson|get|post).*createproof" "$file" | head -5 | while read line; do
            echo "  ${YELLOW}$line${NC}"
        done
        
        FOUND=$((FOUND + 1))
        
        # سوال برای اصلاح خودکار
        echo ""
        read -p "آیا می‌خواهید این فایل را اصلاح کنید؟ (y/n/q): " answer
        
        if [ "$answer" = "q" ] || [ "$answer" = "Q" ]; then
            echo "${YELLOW}⏭️  رد شد${NC}"
            break
        fi
        
        if [ "$answer" = "y" ] || [ "$answer" = "Y" ]; then
            # بکاپ گرفتن
            backup_file="$BACKUP_DIR/$(basename "$file").backup"
            cp "$file" "$backup_file"
            echo "${GREEN}✓ بکاپ گرفته شد:${NC} $backup_file"
            
            # اصلاح فایل (چندین الگو)
            # Pattern 1: fetch('createproof1')
            sed -i.tmp "s|fetch(['\"]createproof1['\"]|fetch('/api/createproof1'|g" "$file"
            # Pattern 2: fetch('/createproof1')
            sed -i.tmp "s|fetch(['\"]\/createproof1['\"]|fetch('/api/createproof1'|g" "$file"
            # Pattern 3: fetch(\`createproof1\`)
            sed -i.tmp "s|fetch(\`createproof1\`|fetch(\`/api/createproof1\`|g" "$file"
            # Pattern 4: fetch(\`/createproof1\`)
            sed -i.tmp "s|fetch(\`/createproof1\`|fetch(\`/api/createproof1\`|g" "$file"
            
            # axios patterns
            sed -i.tmp "s|axios\.post(['\"]createproof1['\"]|axios.post('/api/createproof1'|g" "$file"
            sed -i.tmp "s|axios\.post(['\"]\/createproof1['\"]|axios.post('/api/createproof1'|g" "$file"
            sed -i.tmp "s|axios\.get(['\"]createproof1['\"]|axios.get('/api/createproof1'|g" "$file"
            sed -i.tmp "s|axios\.get(['\"]\/createproof1['\"]|axios.get('/api/createproof1'|g" "$file"
            
            # postJson patterns (from utils/api.js)
            sed -i.tmp "s|postJson(['\"]createproof1['\"]|postJson('/api/createproof1'|g" "$file"
            sed -i.tmp "s|postJson(['\"]\/createproof1['\"]|postJson('/api/createproof1'|g" "$file"
            
            # URL variables
            sed -i.tmp "s|['\"]createproof1['\"]|'/api/createproof1'|g" "$file"
            sed -i.tmp "s|['\"]\/createproof1['\"]|'/api/createproof1'|g" "$file"
            
            # Clean up temp file
            rm -f "$file.tmp"
            
            # Verify changes
            if grep -qE "(fetch|axios|postJson|get|post).*\/api\/createproof1" "$file" 2>/dev/null; then
                echo "${GREEN}✓ فایل اصلاح شد!${NC}"
                FIXED=$((FIXED + 1))
                
                # نمایش تغییرات
                echo "${YELLOW}تغییرات اعمال شده:${NC}"
                grep -nE "(fetch|axios|postJson|get|post).*\/api\/createproof1" "$file" | head -3 | while read line; do
                    echo "  ${GREEN}$line${NC}"
                done
            else
                echo "${YELLOW}⚠️  هشدار: تغییرات اعمال شد اما الگوی جدید پیدا نشد${NC}"
            fi
        fi
    fi
done

echo ""
echo "════════════════════════════════════════"
echo "${GREEN}✓ خلاصه:${NC}"
echo "  فایل‌های پیدا شده: $FOUND"
echo "  فایل‌های اصلاح شده: $FIXED"
echo "  پوشه backup: $BACKUP_DIR"
echo ""

if [ $FIXED -gt 0 ]; then
    echo "${GREEN}🎉 اصلاحات انجام شد!${NC}"
    echo ""
    echo "${BLUE}مراحل بعدی:${NC}"
    echo "  1. npm run build"
    echo "  2. npm run dev"
    echo "  3. تست کردن پرداخت"
    echo ""
    echo "${YELLOW}💾 فایل‌های backup در پوشه زیر ذخیره شده:${NC}"
    echo "  $BACKUP_DIR"
    echo ""
    echo "${YELLOW}برای بازگردانی:${NC}"
    echo "  cp $BACKUP_DIR/FILE.backup ./PATH/TO/FILE"
elif [ $FOUND -eq 0 ]; then
    echo "${YELLOW}⚠️  هیچ فایلی با مشکل پیدا نشد${NC}"
    echo ""
    echo "${BLUE}احتمالاً مشکل در فایل build شده است.${NC}"
    echo ""
    echo "${BLUE}راه‌حل:${NC}"
    echo "  1. rm -rf .next dist build"
    echo "  2. npm run build"
    echo "  3. npm run dev"
    echo ""
    echo "${BLUE}یا از proxy endpoint استفاده کنید:${NC}"
    echo "  fetch('/api/createproof', ...)  ← بدون 1"
    echo "  fetch('/api/createproof1', ...) ← با 1"
else
    echo "${YELLOW}⚠️  هیچ فایلی اصلاح نشد${NC}"
    echo ""
    echo "شما می‌توانید دستی فایل‌ها را اصلاح کنید."
fi

echo ""

