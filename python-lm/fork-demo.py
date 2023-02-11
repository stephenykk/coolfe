#!/usr/bin/env python3
# coding: utf-8

import os

print('process (%s) start..' % os.getpid())

pid = os.fork()

if pid == 0:
    # child thread
    print('subprocess (%s) running, its parent pid is %s.' % (os.getpid(), os.getppid()))
else:
    # main thread
    print('parentprocess (%s) running, child process is %s' % (os.getpid(), pid))


print('the end..')

