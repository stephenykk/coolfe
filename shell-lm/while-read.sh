#!/bin/bash

echo 'type ctrl + d to exit'
echo -n 'enter your hobby:'
while read hobby
do
  echo "you like to do $hobby"
  echo -n 'enter your hobby:'
done

echo bye

