#!/bin/bash

. fns.sh

read -p 'enter your name please: ' username
read -p 'enter your email please: ' email
read -n1 -p 'are you sure to continue? [y/n] ' answer

echo
case $answer in
  [yY]*)
    mylog username email
    ;;
  [nN]*)
    echo bye
    exit
    ;;
  *)
    echo 'just enter y or n please'
    exit
    ;;
esac


