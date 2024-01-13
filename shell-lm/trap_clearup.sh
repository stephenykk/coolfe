#!/bin/bash

trap 'beforeExit; exit' SIGINT SIGQUIT

count=0
tmpfile=`mktemp /tmp/file.$$.XXXXX`

function beforeExit() {
  echo 'you hit ctrl-c, will clear tmp file now'
  rm -f $tmpfile >& /dev/null
}

echo "hello kk..." > $tmpfile

while :
do
  sleep 1
  count=$(expr $count + 1)
  echo $count
done

