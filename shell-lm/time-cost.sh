#!/bin/bash
alias hi='echo hello'
hi

exit 0

alias timestamp='date +%s'

begin=`timestamp`
sleep 10s
finish=$(timestamp)

diff=$(( finish - begin ))

echo "run time: ${diff}"

echo bye

