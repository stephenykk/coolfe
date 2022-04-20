#!/bin/bash

. fns.sh

password=''

echo -n "enter your password: "

while IFS= read -r -s -n1 char
do
  if [ -z $char ]
  then
    echo 
    break
  fi

  # input delete or backspace
  if [[ $char == $'\x08' || $char == $'x7f' ]]
  then
    [[ -n $password ]] && password=${password:0:-1}
    printf '\b \b'
  else
    password+=$char
    printf '*'
  fi
done

mylog password


