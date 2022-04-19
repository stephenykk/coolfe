#!/bin/bash

read -sp "enter your password: " pass

if test "$pass" == "hihi"
then
  echo -e "\n ok"
  exit 0
fi


exit 1

