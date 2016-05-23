#! /bash/sh

test -f sb.sh
echo $?

# -------------------------------
# -e 文件名	如果文件存在则为真
# -r 文件名	如果文件存在且可读则为真
# -w 文件名	如果文件存在且可写则为真
# -x 文件名	如果文件存在且可执行则为真
# -s 文件名	如果文件存在且至少有一个字符则为真
# -d 文件名	如果文件存在且为目录则为真
# -f 文件名	如果文件存在且为普通文件则为真
# -c 文件名	如果文件存在且为字符型特殊文件则为真
# -b 文件名	如果文件存在且为块特殊文件则为真

echo "test 文件"
file_arr=(傻逼 test.sh demo.sh)
for file_item in ${file_arr[@]};
do
    if test -f ${file_item}
    then
        echo "-->【${file_item}】文件存在"
    else
        echo "-->【${file_item}】文件不存在"
    fi
done

# -----------------------------------------------------
# -eq	等于则为真
# -ne	不等于则为真
# -gt	大于则为真
# -ge	大于等于则为真
# -lt	小于则为真
# -le	小于等于则为真
echo 'test 数值'
if test 1 -eq 1
then
    echo "1>1"
fi

# ---------------------------------------------------
# =	等于则为真
# !=	不相等则为真
# -z 字符串	字符串的长度为零则为真
# -n 字符串	字符串的长度不为零则为真
echo 'test string'
if test "ss"="ss"
then
    echo "两个字符串相等"
fi
