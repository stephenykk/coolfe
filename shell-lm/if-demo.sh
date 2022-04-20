#!/bin/bash

read -sp "your name: " name

if test "$name" == "alice"
then
  echo good
  exit 0
else
  echo "access denied"
  exit 1
fi


