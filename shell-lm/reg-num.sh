#!/bin/bash

read -p "please input a number: " num

if [[ $num =~ ^[0-9]+$ ]]
then
  echo "it is a number"
else
  echo "not a number"
fi

