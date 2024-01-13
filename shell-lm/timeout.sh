#!/bin/bash

TMOUT=5

echo are you sure? y/n
read answer

if [ "$answer" == "y" ]
then
  echo yes
else
  echo no
fi


