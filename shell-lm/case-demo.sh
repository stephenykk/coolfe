#!/bin/bash

if [ $# -lt 2 ]
then
 echo "usage $0 num pid "
 exit 1
fi

case "$1" in
  1)
   echo "send SIGHUP signal to pid $2"
   kill -SIGHUP $2
   ;;
  2)
   echo "send SIGINT signal to pid $2"
   kill -SIGINT $2
   ;;
  3)
   echo "send SIGQUIT signal to pid $2"
   kill -SIGQUIT $2
   ;;
  9)
   echo "send SIGKILL signal to pid $2"
   kill -SIGKILL $2
   ;;
  *)
   echo "singal number $1 is no processed"
esac

 
