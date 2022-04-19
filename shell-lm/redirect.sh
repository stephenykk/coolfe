#!/bin/bash

function line() {
  echo ---------------

}


echo hello pan

ls nono


line


# redirect stdout to file
echo hello > out.log

# redirect stderr to stdout
ls not-this-file 2>&1

# redirect stderr and stdout to /dev/null
ls not-found > /dev/null 2>&1

