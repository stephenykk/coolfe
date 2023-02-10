#!/usr/bin/env python3
# coding: utf-8

import asyncio


async def hello():
    print('hello world')
    await asyncio.sleep(3)
    print('hello again')


loop = asyncio.get_event_loop()
loop.run_until_complete(hello())
loop.close()

