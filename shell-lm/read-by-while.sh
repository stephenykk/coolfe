#!/bin/bash

if [ $# -ne 1 ]
then
  echo "usage $0 <file>"
  exit 1
fi

count=0
file="$1"

while read line
do
  let count++
  echo $count $line
done < $file

echo "read total line $count from $file"
exit 0

