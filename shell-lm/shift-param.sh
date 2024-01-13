#!/bin/bash


while [ -n "$1" ]
do
  echo "current arg first: $1 , remains $# "
  shift 2
  if [ $? -ne 0 ]
  then
    break
  fi
done



