#!/usr/bin/env python3

# -*- coding: utf-8 -*-

names = ['lucy', 'lili', 'daizy']
def line():
    print('------------------')

for name in names:
    print(name)

line()

for i in range(10):
    print(i)

line()

n = 1
while n <= 100:
    if n > 10:
        break
    print(n)
    n = n + 1

print('end')

line()

sum = 0
n = 99
while n > 0:
    sum = sum + n
    n = n -2

print('sum %d' % sum)

line()


n = 0
while n < 10:
    n = n + 1
    if n % 2 == 0:
        continue
    print(n)

line()
