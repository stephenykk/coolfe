#!/bin/bash

incolor=$1
likecolor=$1

echo '${var:-defval} use default value'
color=${incolor:-blue}

echo "your favorite color is: $color"

# error can not change position var
# $1=changeval

# echo "can change var1? $1"

echo "incolor: $incolor"


echo "i like the color ${likecolor:=purple}"

echo "likecolor: $likecolor"

echo "if you input likecolor, use other color,  ${incolor:+black}"


echo "what is your ${love:?input your love}"
echo 'you can not see me.'

echo bye


