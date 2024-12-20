#!/usr/bin/env python3
# coding: utf-8

# use asyncio and aiohttp to create a simple web server

import asyncio

from aiohttp import web

async def index(request):
    await asyncio.sleep(0.5)
    return web.Response(body=b'<h1>index</h1>', headers=[('Content-Type','text/html')])

async def hello(request):
    await asyncio.sleep(0.5)
    con = '<h1>hello, %s</h1>' % request.match_info['name']
    return web.Response(body=con.encode('utf-8'), headers=[('Content-Type', 'text/html')])

async def init(loop):
    app = web.Application(loop=loop)
    app.router.add_route('GET', '/', index)
    app.router.add_route('GET', '/hello/{name}', hello)
    
    server = await loop.create_server(app.make_handler(), '127.0.0.1', 8000)
    print('server running on http://localhost:8000')
    
    return server


loop = asyncio.get_event_loop()
loop.run_until_complete(init(loop))
loop.run_forever()



