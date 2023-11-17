#!/bin/bash

function mylower() {
  local str="$@"
  local output
  output=$(tr '[A-Z]' '[a-z]'<<<"$str")
  echo $output
}

function myline() {
  echo --------------------
}


function lastParam() {
  # the last var is varname
  if [ $# -eq 0 ]
  then
    echo "usage: vlog [msg] varname"
    return 1
  fi

  local len="$#"
  local lastIdx=$(( len - 1 ))
  
  # local args="$@" # args is a string
  local args=($@)  # transform string to array
  
  # echo "args:  ${args[@]}"
  # echo "lastIndex $lastIdx"

  # echo "last value: ${args[lastIdx]}"

  # arr=(blue red green)
  # echo "last color: ${arr[lastIdx]}"

  varName="${args[lastIdx]}"
  
}

function mylog() {
 if [ $# -eq 0 ]
 then
   echo "usage:  vlog varname/msg [varname/msg]..."
   return 1
 fi

 
 local arr=()

 for v in $@
 do
  if [ "$v" = *[[:space:]]* ]
  then
    arr[${#arr[*]}]="$v"    
  else 
    if declare -p $v > /dev/null 2>&1
    then
      arr[${#arr[*]}]="$v: ${!v}"
    else
      arr[${#arr[*]}]="$v"
    fi
  fi     
 done

 echo "${arr[*]}"
}
