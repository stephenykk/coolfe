#!/bin/bash

echo "adjust window size"
trap "echo window size changed..." SIGWINCH

count=0

while [ $count -lt 30 ]
do
  count=$(( $count + 1 ))
  sleep 1
done


