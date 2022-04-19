#!/bin/bash

if [ $# -eq 0 ]
then
  echo "$0 : must give one integer var"
elif [ $1 -gt 0 ]
then
  echo "the number is positive"
elif [ $1 -lt 0 ]
then
  echo "the number is negative"
elif [ $1 -eq 0 ]
then
  echo "the number is zero"
else
  echo "$1 is not a number"
fi


