#!/bin/bash

# color=blue
# export vars can be visit by child process
export color=blue-and-green
echo "color is $color"

bash echo-color.sh

echo done! 
