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



declare -r TRUE=0
declare -r FALSE=1
declare -r PASS_FILE=/etc/passwd
function is_root() {

  [ $( id -u ) -eq 0 ] && return $TRUE || return $FALSE
}

function is_user_exist() {
  local user=$1
  grep "^$user" $PASS_FILE && return $TRUE || return $FALSE
}

function factorial() {
  [ $# -eq 0 ] && { echo "usage: $0 number"; exit 1; }

  local i="$1"
  local f
  declare -i i
  declare -i f

  [ $1 -le 2 ] && echo $i || { f=$(( i - 1 )); f=$(( $(factorial $f) * i )); echo $f; }
}


