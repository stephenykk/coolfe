#!/bin/bash


for v 
do
  echo $v
done


function line() {
  echo ------------
}

line

for m in one two world help
do
  echo "cur val: $m"
done

line

for fname in $HOME/.bash*
do
  echo "file: $fname"
done

line

for yfile in $HOME/*y
do
  echo "yfile: $yfile"
done

line

for vfile in $PWD/var*
do
  echo "vfile: $vfile"
done

 
echo
echo bye

line


colors="blue green red"
for color in $colors
do
  echo "color: $color"
done

line

for subfile in `ls .`
do
  echo "file: $subfile"
done

line

for (( i = 0 ; i < 5; i++ ))
do
  echo "c style for, i: $i"
done


