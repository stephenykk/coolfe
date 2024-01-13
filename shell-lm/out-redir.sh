#!/bin/bash

exec 4> ~/dev/shell-lm/out

date >&4 
uname -a >&4

exec 4>&-
