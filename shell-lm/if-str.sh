#!/bin/bash

# str condition

if [ "$1" = hi ]
then
  echo welcome
else
  echo not greeting
fi

if [ "$1" ]
then
  echo "your input var: $1"
else
  echo "you forget to input var"
fi

if [ -n "$1" ]
then
  echo "input var $1"
else
  echo "var1 is empty"
fi



