#!/bin/bash

code=65

if [ ! -n "$1" ]
then
  echo "usage: `basename $0` arg1 arg2..."
  exit $code
fi

i=1

for arg in $*
do
  echo "arg #$i: $arg"
  let i+=1
done

echo 

i=1
