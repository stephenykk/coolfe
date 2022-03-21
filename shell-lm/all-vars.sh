#!/bin/bash

function line() {
  echo ---------------
}

echo 'walk $*'
for v in $*
do
  echo $v
done

line

echo 'walk $@'
for m in $@
do
  echo $m
done

line

echo 'walk "$*"'
for n in "$*"
do
  echo $n
done

line

echo 'walk "$@"'
for j in "$@"
do
  echo $j
done


