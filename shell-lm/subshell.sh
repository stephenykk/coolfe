#!/bin/bash
(
while [ 1 ]
do
  echo 'subshell running..'
  sleep 2
done

echo 'will not see me'
)
