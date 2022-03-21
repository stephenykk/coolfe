#!/bin/bash

exec 6>&1
logfile=~/dev/shell-lm/log
exec > $logfile

echo -n "logfile:"
date

echo '---------'


exec 1>&6 6>&-

echo
echo '------------stdout now restore to default-------------'
echo

uname -a

exit 0
