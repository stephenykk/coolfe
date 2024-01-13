#!/usr/bin/env python3
# coding: utf-8

import asyncio

@asyncio.coroutine
def hello():
    print('hello world')
    r = yield from asyncio.sleep(1)
    print('hello again')

eventLoop = asyncio.get_event_loop()
eventLoop.run_until_complete(hello())
eventLoop.close()



