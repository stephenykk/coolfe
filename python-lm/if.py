# -*- coding: utf-8 -*-

userAge = input('what is your age? ')
userAge = int(userAge)

if userAge >= 18:
  print('大人')
elif userAge >= 8:
  print('少年')
else:
  print('儿童')


