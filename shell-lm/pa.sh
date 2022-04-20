#!/bin/bash
echo parent shell, shell level is $SHLVL 
export color=blue
echo "parent say the color is $color"
echo "call child shell"
bash ch.sh
echo "parent done"

