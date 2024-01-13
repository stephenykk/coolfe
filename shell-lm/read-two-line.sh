#!/bin/bash

if [ $# -ne 1 ]
then
  echo "usage $0 <file>"
  exit 1
fi

file="$1"

{
  read line1
  read line2
} < $file

echo "first line in $file is: $line1"
echo "second line in $file is: $line2"
exit 0
