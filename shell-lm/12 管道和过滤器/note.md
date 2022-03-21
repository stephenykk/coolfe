# 管道和过滤器

语法

cmd1 | cmd2 

cmd1的输出作为cmd2的输入

`>` 和 `|`的区别

`>` 将命令和文件连接； `|`将命令和命令连接

管道上多个命令的错误输出会合并到一起，输出到stderr

```bash
ls | grep data.txt
ps aux | grep httpd > /tmp/ps-output.txt
cat web.log | less
who | sort
who | wc -l
mount | column -t
cat ips.txt | tr '\n' ' '

# cmd1 < input.txt | cmd2 > out.txt
tr a-z A-Z < os.txt | sort | uniq > out.txt

```

## 过滤器

`cmd1 | cmd2 | cmd3` 管道中的命令，称之为过滤器

过滤器从stdin获取输入，把结果输出到stdout

常用过滤器：
- `awk`
- `cut`
- `grep`
- `tar`
- `head`
- `paste`
- `sed`
- `sort`
- `split`
- `wc`
- `uniq`

```bash
awk -F: '{print $1}` /etc/passwd | sort
history | awk '{print $2}' | sort | uniq -c | sort -rn | head
free | grep Mem | awk '{print $2}'
grep "/bin/bash" /etc/passwd | cut -d: -f1,6
cat /proc/cupinfo | grep name | cut -d: -f2 | uniq
ls -l ~ | cut -c 1 | grep d | wc -l
grep -i "error:" /var/log/messages | less
ls -l | grep "^d"
ls /bin /usr/bin | sort | uniq | grep zip
cat data.txt | sed 's/front/back'
cat -n /etc/passwd | head | sed '3,6d'
cat -n /etc/passwd | sed -n '3,5p'
ls -al | sort -rn -k5
ls -al | tail -n 5
sort /etc/passwd -t: -k3 -n | tail -n1
# tee命令，统一时间查看和存储其他命令的输出
ls | tee ls-out.txt
# 重复标准输出
echo hello kk | tee - # tee的输出再重定向到stdout

# 空格转换为换行
echo "this is a long road" | tr [:space:] '\n'

echo hello world | tr [:lower:] [:upper:]

sort data.txt | uniq -c | sort -nr


```


