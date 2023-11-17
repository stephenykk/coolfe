#!/usr/bin/env python3
# coding: utf-8

import time, sys, queue
from multiprocessing.managers import BaseManager

class QueueManager(BaseManager):
    pass

QueueManager.register('get_task_queue')
QueueManager.register('get_result_queue')

server_addr = '127.0.0.1'
print('Connect to server %s ...' % server_addr)

qm = QueueManager(address=(server_addr, 5000), authkey=b'abc')
qm.connect()

tq = qm.get_task_queue()
rq = qm.get_result_queue()

for i in range(10):
    try:
        n = tq.get(timeout=1)
        print('run task %d * %d' % (n, n))
        r = '%d * %d = %d' % (n, n, n * n)
        time.sleep(1)
        rq.put(r)
    except Queue.Empty:
        print('task queue is empty')

print('worker exit')

