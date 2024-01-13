#!/bin/bash

function hello() {
 if [ "$1" = 1 ]
 then
    echo yes
 else
    echo no
 fi

 return 2
}

hello $1

echo "hello result: $?"

# $? get function return value
# result=`fn` get function output

result=`hello $1`

echo "hello function output: $result"


echo 'last cmd result: $?'
echo "result: $?"
