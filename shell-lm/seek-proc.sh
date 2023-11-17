#!/bin/bash

echo "try to find exists process"

function checkpid() {
for pid in $*
do
  [ -d "/proc/$pid" ] && echo "found $pid " && return 0
done

return 1
}

checkpid $*

if [ $? -eq 0 ]
then
  echo "one of them is running"
else
  echo "all of them not running"
fi


