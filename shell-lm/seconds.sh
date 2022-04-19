#!/bin/bash

interval=1
maxtime=20

while [ "$SECONDS" -lt "$maxtime" ]
do
  echo this script runs $SECONDS seconds
  sleep $interval
done


