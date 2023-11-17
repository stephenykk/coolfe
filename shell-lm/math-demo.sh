#!/bin/bash

function line() {
  echo -----------
}

let val=5**2
echo $val

let val2=9%2
echo $val2

let val2++
echo $val2

let val2+=10
echo $val2

let val2*=2
echo $val2

line

# expression eval
echo $(( 2 && 3 ))
echo $(( 2 && 0 ))

line 

# return last expression
let val3=(2+3, 10-1, 20-1)
echo $val3

line

# 进制前缀 0 0x base#number
let oct=020
echo $oct

let hex=0x20
echo $hex

let bin=2#111
echo $bin
let base32=32#20
echo $base32


line

age=2
age=$(( $age + 10 ))
echo "age: $age"

line

a=3
b=8
result=$(( a % b ))
echo "result: $result"

line

bigger=$(( b > a ))
echo "bigger: $bigger"

line

bignum=$(( $(( a > b )) ? a : b ))
echo "bignum is $bignum"

line

i=10
let i=i+3
echo "i is $i"

# can not use space
# let i=i + 3 # bad

j=1
let "j=j + 10"
echo "j is $j"

