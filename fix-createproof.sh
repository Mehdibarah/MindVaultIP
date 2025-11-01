#!/bin/bash

# 🔧 اسکریپت خودکار برای پیدا کردن و اصلاح مشکل createproof1

echo "🔍 جستجوی فایل‌های مشکل‌دار..."
echo ""

# رنگ‌ها
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# پیدا کردن فایل‌های مشکل‌دار
echo "📂 جستجو در پوشه src/..."
FILES=$(find ./src -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \) 2>/dev/null)

if [ -z "$FILES" ]; then
    echo "${YELLOW}⚠️  پوشه src/ پیدا نشد. جستجو در پوشه جاری...${NC}"
    FILES=$(find . -maxdepth 3 -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \) \
            ! -path "*/node_modules/*" ! -path "*/.next/*" ! -path "*/dist/*" 2>/dev/null)
fi

FOUND=0
FIXED=0

for file in $FILES; do
    # چک کردن اگه فایل شامل createproof هست
    if grep -q "createproof" "$file" 2>/dev/null; then
        echo ""
        echo "${GREEN}✓ فایل پیدا شد:${NC} $file"
        
        # نمایش خطوط مشکل‌دار
        echo "${YELLOW}خطوط مشکل‌دار:${NC}"
        grep -n "createproof" "$file" | head -5
        
        FOUND=$((FOUND + 1))
        
        # سوال برای اصلاح خودکار
        echo ""
        read -p "آیا می‌خواهید این فایل را اصلاح کنید؟ (y/n): " answer
        
        if [ "$answer" = "y" ] || [ "$answer" = "Y" ]; then
            # بکاپ گرفتن
            cp "$file" "$file.backup"
            echo "${GREEN}✓ بکاپ گرفته شد:${NC} $file.backup"
            
            # اصلاح فایل
            sed -i.tmp "s|fetch(['\"]createproof1['\"]|fetch('/api/createproof1'|g" "$file"
            sed -i.tmp "s|fetch(['\"]\/createproof1['\"]|fetch('/api/createproof1'|g" "$file"
            sed -i.tmp "s|axios\.post(['\"]createproof1['\"]|axios.post('/api/createproof1'|g" "$file"
            sed -i.tmp "s|axios\.post(['\"]\/createproof1['\"]|axios.post('/api/createproof1'|g" "$file"
            
            rm -f "$file.tmp"
            
            echo "${GREEN}✓ فایل اصلاح شد!${NC}"
            FIXED=$((FIXED + 1))
            
            # نمایش تغییرات
            echo "${YELLOW}تغییرات:${NC}"
            diff "$file.backup" "$file" || echo "تغییرات اعمال شد"
        fi
    fi
done

echo ""
echo "════════════════════════════════════════"
echo "${GREEN}✓ خلاصه:${NC}"
echo "  فایل‌های پیدا شده: $FOUND"
echo "  فایل‌های اصلاح شده: $FIXED"
echo ""

if [ $FIXED -gt 0 ]; then
    echo "${GREEN}🎉 اصلاحات انجام شد!${NC}"
    echo ""
    echo "مراحل بعدی:"
    echo "  1. npm run build"
    echo "  2. npm run dev"
    echo "  3. تست کردن پرداخت"
    echo ""
    echo "در صورت مشکل، فایل‌های backup موجود است:"
    find . -name "*.backup" ! -path "*/node_modules/*" 2>/dev/null
else
    echo "${YELLOW}⚠️  هیچ فایلی اصلاح نشد${NC}"
    echo ""
    echo "احتمالاً فایل build شده مشکل دارد."
    echo "این دستور رو اجرا کنید:"
    echo "  rm -rf .next dist build"
    echo "  npm run build"
fi

echo ""