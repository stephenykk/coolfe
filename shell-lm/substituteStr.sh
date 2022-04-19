#!/bin/bash

args=3

if [ $# -ne $args ]
then
  echo "usage: `basename $0` searching replacement file"
  exit 1
fi

searching=$1
replacement=$2

if [ -f $3 ]
then
  fname=$3
else
  echo "$3 do not exists"
  exit 2
fi

sed -e "s#$searching#$replacement#" "$fname"

exit 0

