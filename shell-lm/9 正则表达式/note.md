# 正则表达式

POSIX字符类 和 bash的正则表达式操作符 正则表达式元字符

正则表达式的类型:

- 基本正则表达式
- 扩展正则表达式

基本正则表达式的元字符：

- `*` 任意多次匹配
- `.` 非换行的任意字符
- `^` 行首
- `$` 行末
- `[]` 字符集
- `\` 转义
- `\<\>` 单词边界

扩展正则表达式增加的元字符:

- `?` 匹配0-1次
- `+` 匹配>=1次
- `\{\}` 指定匹配次数范围
- `()` 分组
- `|` 或

POSIX字符类

- `[:alnum:]`
- `[:alpha:]`
- `[:blank:]`
- `[:space:]`
- `[:lower:]`
- `[:upper:]`

`=~` 正则比较

```bash
if [[ $digit =~ ^[0-9]+$ ]]; then
  echo "$digit is digit"
else
  echo "$digit is not digit"
fi

# check ip
if [[ "$1" =~ ^[0-9]{1,3}(\.[0-9]{1,3}){3}$ ]]
then
  echo "good ip"
else
  echo "bad ip"
fi


grep "hi." data.txt
grep ^root /etc/passwd
grep -v '^$' data.txt # 打印非空行
egrep "\<i.*k\>"  data.txt # ixxxk的单词


```


