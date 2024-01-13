#!/bin/bash

# sum by expr
sum=`expr ${1:?need num1} + ${2:?need num2}`
echo "sum: $sum"

# sum by $[]
ret=$[ $1 + $2 ]
echo "ret: $ret"

# numbers compare use -eq, ...
if test $1 -eq $2
then
  echo equal
else
 echo not equal
fi



echo bye

