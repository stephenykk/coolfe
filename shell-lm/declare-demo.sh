#!/bin/bash

# show all vars
declare > all-vars.log

# declare var type , same as typeset


# declare ready only var
declare -r fav=comic
fav=shopping


echo "your fav is $fav"

# can not unset readonly var
unset fav

# declare integer
declare -i age
age=10
age=10/2
echo "the age is $age"

# print var value and type
declare -p age

# declare array var
declare -a colors=('red' 'green' 'blue')
