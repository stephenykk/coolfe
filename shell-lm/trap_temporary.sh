#!/bin/bash

trap '' SIGINT SIGQUIT

echo "you can not terminate me, by ctrl-c"

sleep 10

trap 'echo terminated~~; exit' SIGINT SIGQUIT
echo 'ok, you can terminate me by ctrl-c'
sleep 10


