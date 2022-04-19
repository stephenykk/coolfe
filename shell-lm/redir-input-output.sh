#!/bin/bash

. fns.sh

exec 3< ./data
exec 4> ./out

read -u 3 a b
echo "data read from fd 3:"
mylog "first value:" a "second value:" b

echo "writing data to fd 4"
echo "field #1 - $a " >&4
echo "field #2 - $b " >&4

exec 4>&-
exec 3<&-

