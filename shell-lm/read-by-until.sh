#!/bin/bash

if [ $# -ne 1 ]
then
  echo "usage $0 <file>"
  exit 1
fi

file="$1"
count=0

until ! read line
do
 let count++
 echo $count $line
done < $file

echo "total line of $file is $count"
exit 0
