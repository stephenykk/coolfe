#!/bin/bash

if [ $# -ne 1 ]
then
  echo "usage $0 <file>"
  exit 1
fi

file="$1"
count=0

if true;
then
  let count++
  read line
  echo $count $line
fi < $file

echo "if redirect get one line content"

