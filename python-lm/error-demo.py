#!/usr/bin/env python3
# coding: utf-8

try:
    print('try...')
    r = 10 / 0
    print(r)
except ZeroDivisionError as e:
    print('excpet: , ', e)
finally:
    print('finally..')


