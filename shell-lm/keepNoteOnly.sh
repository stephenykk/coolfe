#!/bin/bash

echo "args count: $#"
echo "arg1 is: $1"

function line() {
  echo '-----------------------------'
}


count=1
for var in $@
do
  echo "var${count}: $var"
  count=`expr $count + 1`
done



function usage() {
  echo "usage: `basename $0` dir"
}

dir="$1"
echo "dir is: $dir"


if [ -z "$dir" ]
then
  usage
  exit 1
fi

if [ ! -d "$dir" ]
then
  echo "no dir $dir"
  exit 2
fi

line

dir=${dir%/}

for f in `ls "$dir"`
do
  if [[ ! "$f" =~ ^note ]]
  then
    echo "$dir/$f"
    rm -rf "$dir/$f"
  fi

done

line 
echo "finish."

