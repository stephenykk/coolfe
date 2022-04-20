#!/bin/bash



function checkpid() {
  local i

  for i in $*
  do
    echo checking pid : $i
    [ -d "/proc/$i" ] && return 0
  done

  return 1
}

checkpid "$*" 

if [ $? = 0 ]
then
  echo "one of them is running"
else
  echo "all of them is not running"
fi 
