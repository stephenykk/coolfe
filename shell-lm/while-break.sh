#!/bin/bash

while :
do
  echo -n "input a number between 1 to 5: "
  read num
 
  case $num in
    1|2|3|4|5)
        echo "your choosen number is: $num"
        ;;
    *)
       echo "invalid number $num"
       break
       ;;
  esac
done

echo bye


