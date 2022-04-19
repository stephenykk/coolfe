# bash 循环

bash 支持常见的循环 for while until select 和 break continue循环控制

## for循环

```bash
# 语法
for val in item1 item2 ... itemn
do
  cmd
done

for val in $arr
do
  cmd
done

for param 
do
  cmd
done

for val in $(cmd)
do
  cmd
done


for (( expr1; expr2; expr3 ))
do
  cmd
done

# 例子
for i in 1 2 3
do
  echo "loop time $i"
done

for color in red blue green
do
  echo "color: $color"
done

words="i will help you for ever"
for w in $words
do
  echo $w
done

files=(a.jpg b.jpg c.jpg)
for fname in $files
do
  [ -f $fname ] || echo "not found $fname"
done


for fname in `ls /tmp/*`
do
  echo $fname
done

for (( i = 0; i < 3; i++ ))
do
  echo "val: $i"
done

```


## while循环

```bash
while [condition]
do
  cmd
done


# 逐行读取文件内容
while IFS= read -r line
do
  cmd
done < "/path/to/file"

c=1
while [ $c -le 5 ]
do
  echo "loop time $c"
  # c=$(( c + 1 ))
  # let c=c+1
  c=$(expr $c + 1)
done

# 读取文件内容
file="$1"

if [ $# -lt 1 ]
then
  echo "usage: $0 filepath"
  exit 1
fi

while read -r line
do
  echo $line
done < "$file"

# 无限循环 : 是bash内部命令 type :
while :
do
  cmd
done

while true
do
  echo "do something..."
  echo "hit [ctrl+c] to stop"
  sleep 3
done
```

### until循环

```bash
# 直到满足条件，退出循环
until [condition]
do
 cmd
done

count=1
until [ $count -gt 3 ]
do
  echo "loop time $count"
  let count=count+1
done


```

## select 循环

```bash
select val in list
do
  cmd
done


# 快速生成菜单
select choice in install repair exit
do
  case $choice in
    install)
      echo "install system"
      ;;
    repair)
      echo "repair system"
      ;;
    exit)
      echo "see you"
      ;;
    *)
      echo "bad choice"
  esac
done


```


## 循环控制 break continue
同其他语言


