#!/usr/bin/env python3
# coding: utf-8

from enum import Enum

class Gender(Enum):
    Male = 0
    Female = 1

class Student(object):
    def __init__(self, name, gender):
        self.name = name
        self.gender = gender


s = Student('kk', Gender.Male)
if s.gender == Gender.Male:
    print('succ')
else:
    print('fail')


