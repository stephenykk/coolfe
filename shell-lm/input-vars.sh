#!/bin/bash

echo "var1: $1, var2:$2"

echo -n \$*: 
echo $*

echo -n \$@:
echo $@

echo bye
