#!/bin/bash

function cleanup () {
  echo 'cleaning up something...'
  if [ -e $msgfile ]
  then
    rm -f $msgfile
  else
    echo "$msgfile not exists"
  fi

  exit
}

trap cleanup INT TERM

msgfile=`mktemp /tmp/test-trap.$$.XXX`

echo "create $msgfile done..."

echo 'please input some words'
# input by cli, output to msgfile
cat > $msgfile

echo "think of seding to some email"

rm $msgfile


# reset  trap 
trap - INT TERM
