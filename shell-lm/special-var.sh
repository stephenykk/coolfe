#!/bin/bash

set one two three
echo "$*"

IFS='--'
echo "$*"

echo "var nums: $#"

ls no-this-file
echo "last cmd exist result $?"


echo "opt flag: $-"

echo "current process id: $$"

# grep hello foo.sh &
sleep 10 &

echo "last background running process id: $!"


jobs

echo "this shell script name: $0"

