#!/usr/bin/env python3
# coding: utf-8

import hmac, random

def hmac_md5(key, s):
   return  hmac.new(key.encode('utf-8'), s.encode('utf-8'), 'MD5').hexdigest()
 
class User(object):
     def __init__(self, username, password):
         self.username = username
         self.key = ''.join([chr(random.randint(48, 122)) for i in range(20)])
         self.password = hmac_md5(self.key, password)

db = {
        'alice': User('alice', 'good'),
        'lufy': User('lufy', 'smile')
     }



def login(username, password):
    user = db[username]
    return user.password == hmac_md5(user.key, password)


print(login('lufy', 'smile'))



