#!/bin/bash

colors[2]=blue
echo "the third ele is: ${colors[2]}"

colors[0]=red
# only print first ele
echo "the first ele is $colors"

# print all eles
echo "whole arr is ${colors[@]}"

unset colors

echo "after unset arr, whole arr is ${colors[@]}"

