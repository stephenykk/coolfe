#!/bin/bash

old_ifs="$IFS"

if [ $# -ne 1 ]
then
  echo "usage: `basename $0` filename"
  exit
fi

IFS=$'\n'
for line in $(cat $1)
do
  echo $line
done

IFS=$old_ifs

