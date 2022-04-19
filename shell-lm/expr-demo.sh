#!/bin/bash

function line(){ 
  echo --------
}

r=$(expr 6 + 3)
echo "r : $r"

r=$(expr 8 \* 2)
echo $r

set -x
r=$(expr 3 \< 2)

echo $r

line

set +x

a=10
b=2
echo `expr $a + $b`

line

str="hello , today"
echo "str length: $(expr length "$str")"  # vars inside expr ,should use quotes, eg: "$str"
echo "str 'eee to' index:  $( expr index  "$str" wwhellw)"


