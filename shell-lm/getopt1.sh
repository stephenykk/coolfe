#!/bin/bash

# set position params
set -- `getopt f:vl "$@"`

while [ $# -gt 0 ]
do
  echo $1
  shift
done


