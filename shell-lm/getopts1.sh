#!/bin/bash

while getopts ":a" opt
do
  case $opt in
    a)
      echo "get -a option"
      ;;
    \?)
      echo "invalid option: -${OPTARG}   opt: $opt"
      ;;
  esac
done


