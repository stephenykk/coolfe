#!/bin/bash

ONE=1
args=2
E_badArgs=2
number=1

if [ $# -ne $args ]
then
  echo "usage: `basename $0` searching replacement"
  exit $E_badArgs
fi

for filename in *$1*
do
  if [ -f $filename ]
  then
    fname=`basename "$filename"`
    newname=`echo $fname | sed -e "s/$1/$2/"`
    mv "$fname" "$newname"
    let "number += 1"
  fi
done

if [ $number -eq $ONE ]
then
  echo "$number file renamed."
else
  echo "$number files renamed."
fi

exit 0

