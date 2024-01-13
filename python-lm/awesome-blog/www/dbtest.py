#!/usr/bin/env python
# coding: utf-8

import asyncio
import orm
from models import User

async def test(loop):
    await orm.create_pool(loop=loop, user='www-data', password='pan', db='awesome')
    user = User(name='kk', passwd='hi', email='kk@123.com', image='abount:blank')
    await user.save()


loop = asyncio.get_event_loop()
loop.run_until_complete(test(loop))
