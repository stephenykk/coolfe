#!/usr/bin/env python3
# coding: utf-8

class Student(object):
    def __init__(self, name):
        self.name = name

    def __call__(self):
        print('my name is %s' % self.name)


s = Student('kk')
s()


