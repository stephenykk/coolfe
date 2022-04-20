#!/bin/bash

PS3="Run command:"

select choice in date w hostname "uname -a" exit
do
  case $choice in
   date)
    echo "choose date"
    $choice
    ;;
   w)
    echo "choose w"
    $choice
    ;;
   hostname)
     echo "choose hostname"
     $choice
     ;;
   *)
    echo "choose others"
    $choice
  esac
done


