#!/bin/bash

if [ -n "$1" ] && [ -e "$1" ]
then
  echo "$1 is not null and a file name $1 exists"
fi

# same as above

if [[ -n "$1" && -e "$1" ]]
then
 echo "also fire: $1 not null and exists"
fi

# same too

if [ -n "$1" -a -e "$1" ]
then
  echo "haha: $1 not null and exists too~~~"

fi


# or
if [ "$1" -eq 1 ] || [ "$1" -eq 2 ]
then
  echo "test ok"
else
  echo "test fail"
fi

if [ "$1" -eq 1 -o "$1" -eq 2 ]
then
  echo "test ok too"
else
  echo "test fail again"
fi

if [[ "$1" -eq 1 || "$1" -eq 2 ]]
then
  echo "test ok!!"
else
  echo "test not ok!!"
fi

# not

if [ ! -f hello.sh ]
then
  echo "not found hello.sh"
else
  echo "hello.sh exists"
fi

