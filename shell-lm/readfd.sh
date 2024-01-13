#!/bin/bash

if [ $# -ne 1 ] || [ ! -f $1 ]
then
  echo "usage: $0 <file>"
  exit 1
fi

# 作为输入文件，并指定描述符3
exec 3< $1

# 将标准输入作为描述符3的副本
cat <& 3

# 关闭文件描述符3
exec 3<&-




