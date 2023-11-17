#!/bin/bash

a="${1:-0}"
b=10

if [ "$a" -ne $b ]
then
 echo "not equal"
else
 echo "equal"
fi


