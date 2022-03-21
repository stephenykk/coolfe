#!/bin/bash

if [ $# -ne 1 ]
then
  echo "usage $0 <file>"
  exit 1
fi


file=$1

exec 3< $file
# read -u ，read from specify fd
while read -r -u 3 line
do
  echo $line
  read -p "press any key: " -n 1
  echo
done


# close fd 3
exec 3<&-

