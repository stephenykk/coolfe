#!/bin/bash

while read -r f1 f2
do
  echo "field 1: $f1 , field 2: $f2 "
done < "./data.txt"


