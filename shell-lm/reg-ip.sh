#!/bin/bash

if [ $# -ne 1 ]
then
  echo "usage: $0 ipaddr"
  exit 1
fi

ip="$1"
if [[ $ip =~ ^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$ ]]
then
  echo "it is an ipv4 addr"
elif [[ $ip =~ ^[a-fA-F0-9:]+$ ]]
then
  echo "it is an ipv6 addr"
else
  echo "it is not an ip addr"
fi


