#!/bin/bash

val="$1"

if [[ $val =~ [0-9] ]]
then
  echo "$val has a digital"
else
  echo "not digital"
fi

