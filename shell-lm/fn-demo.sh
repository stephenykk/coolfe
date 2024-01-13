#!/bin/bash


. fns.sh




# all var is global by default


fav=sleep
echo "your fav is: $fav"

function setFav() {
  fav=learning
}

setFav

echo "after call fn, your fav is: $fav"

function line() {
 echo ------------
}

line 

# declare or set local var
color=blue

echo "like color: $color"

function setLocalColor() {
  local color=crimson
  echo "color in fn: $color"
}

setLocalColor
echo "after call fn, like color: $color"

line

echo $(lower 'KooMcc')


