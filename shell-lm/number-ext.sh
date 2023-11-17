#!/bin/bash

# 算术扩展
var=5
var=$(( $val + 8 ))
echo $var


x=18
y=5
z=$(( x % y ))
echo $z

a=10
b=3
c=$(( $(( a > b )) ? a : b ))
echo $c
