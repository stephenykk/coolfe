#!/bin/bash

a=1
until [ ! $a -lt 10 ]
do
  a=`expr $a + 1`
  echo "looping a is: $a"
done

echo "a is: $a"

echo bye
