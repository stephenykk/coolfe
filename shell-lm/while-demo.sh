#!/bin/bash

function line() {
  echo ------------
}


counter=0
while [ $counter -lt 5 ]
do
 # counter=`expr $counter + 1`
 counter=$[ $counter + 1 ]
  
done

echo "counter: $counter"

echo bye

line

