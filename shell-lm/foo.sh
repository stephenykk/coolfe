#!/bin/bash

opt="${1}"
case $opt in
  -f)
     fname="$2"
     echo "file name is $fname"
     ;;
  -d)
      dirname="$2"
      echo "dir name is $dirname"
      ;;
   *)
      echo "`basename $0`: usage: [-f file] | [-d dir]"
      exit 1
      ;;
esac

echo bye

 
