#!/usr/bin/env python3
# coding: utf-8

class Student(object):
    def __init__(self):
        self.name = 'kk'

    def __getattr__(self, attr):
        if attr == 'fav':
            return 'comic'
        else:
            return 'undefined'



s = Student()
print(s.name)
print(s.fav)
print(s.age)

# ----------------------------------------

class Chain(object):
    def __init__(self, path=''):
        self._path = path

    def __getattr__(self, attr):
        if attr == 'users':
            return lambda name: Chain('%s/%s' % ('users', name))

        return Chain('%s/%s' % (self._path, attr))

    def __str__(self):
        return self._path

    __repr__ = __str__


print(Chain().status.user.timelime.list)
print(Chain().users('kk').repos)

    



