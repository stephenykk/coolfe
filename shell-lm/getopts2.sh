#!/bin/bash

while getopts ":hvf:o:" opt
do
  case "$opt" in 
    v)
      vflog=on
      ;;
    f)
      filename=$OPTARG
      if [ ! -f $filename ]
      then
        echo "the file do not exits"
        exit
      fi
      ;;
    o)
      output=$OPTARG
      if [ ! -d $output ]
      then
        echo "the output dir do not exits"
      fi
      exit
      ;;
    h)
      echo "show usage"
      exit
      ;;
    :)
      echo "the options -$OPTARG require an argument"
      exit 1
      ;;
    ?)
      echo "invalid options: -$OPTARG"
      exit 2
      ;;
  esac
done


