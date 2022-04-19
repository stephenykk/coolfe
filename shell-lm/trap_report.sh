#!/bin/bash

echo 'will trap signal int hup quit'
trap 'beforeExit $LINENO $BASH_COMMAND; exit' SIGINT SIGHUP SIGQUIT

function beforeExit() {
  echo "$(basename $0) caught error on line $1 , command: $2"
}

while :
do
  sleep 1
  count=$(( $count + 1 ))
  echo $count
done


