#!/bin/bash

function log() {
  echo
  echo $*
  echo ---
}

log '$0 is:' $0

# call:  bash set.sh one flower one world
log raw position params
for p in $@
do
  echo $p
done

log after set position params
# $@=x y z 
set x y z 
for v in $@
do
  echo $v
done


log another test 

for var in x y z
do
  echo $var
done

