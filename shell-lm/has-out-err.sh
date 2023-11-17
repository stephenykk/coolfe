#!/bin/bash

# $0 &>/dev/null  # both redirect stdout and sterr
# $0 >&/dev/null  # same as above
# $0 2>1 > /dev/null # same as above
# $0 > /dev/null 2>&1 # same as above

echo hello world
ls not-this-file


