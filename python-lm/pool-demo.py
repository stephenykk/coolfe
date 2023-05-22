#!/usr/bin/env python3
# coding: utf-8

from multiprocessing import Pool
import os, time, random

def longTimeTask(name):
    print('run task %s (%s)...' % (name, os.getpid()))
    start = time.time()
    time.sleep(random.random() * 4)
    end = time.time()
    print('task %s runs %0.2f seconds' % (name, (end - start)))


if __name__ == '__main__':
    print('parent process %s.' % os.getpid())
    p = Pool(4)
    for i in range(5):
        p.apply_async(longTimeTask, args=(i,))
    print('waiting for all child process done..')
    p.close()
    p.join()
    print('all child process done.')


