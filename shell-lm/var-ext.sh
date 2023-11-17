#!/bin/bash

# var name is a variable
feeling=happy
happy=yes

echo "are you happy? " ${!feeling}

# first letter upperCase, support by bash 4.x
fav=helloWorLd
echo ${fav^}

# all upperCase
echo ${fav^^}

# first letter lowerCase
echo ${fav,}

# all lowerCase
echo ${fav,,}

# rename file to lowerCase name
for file in *.js
do
  mv "$file" "${file,,}"
done

# vars prefix is BASH
echo ${!BASH*}

echo ${!BASH@}


# remove str part
filename=linux-is_funny.txt
echo ${filename%.*}
echo ${filename##*.}


fpath=/home/pan/hello.txt
echo ${fpath%/*}
echo ${fpath##*/}

# string search and replace
greets="hi, i want to say hi to you"
echo ${greets/hi/hello}
echo ${greets//hi/hello}
echo ${greets/hi}
echo ${greets//hi}

# string len
echo ${#greets}

# string slice
echo ${greets:3}
echo ${greets:3:5}

# default val
# ${param:-default value}
# ${param-default value}

# ${param:=hello world}
# ${param?'msg tips'}


echo bye

