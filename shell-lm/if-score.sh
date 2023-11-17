#!/bin/bash

if [ $# -eq 0 ]
then
 echo "usage: `basename $0` number"
 exit 1
fi

score="$1"
if [ "$score" -ge 90 ] && [ "$score" -le 100 ]
then
  echo "excellent!"
elif [[ "$score" -ge 80 && "$score" -lt 90 ]]
then
  echo "good!"
elif [ "$score" -ge 70 ] && [ "$score" -lt 80 ]
then
  echo "pass!"
elif [[ "$score" -gt 0 && "$score" -lt 70 ]]
then
  echo "fail!"
else 
  echo "wrong number"

fi


