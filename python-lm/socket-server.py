#!/usr/bin/env python3
# coding: utf-8

import socket
import threading, time

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

s.bind(('0.0.0.0', 7788))

s.listen(5)

print('Waiting for connections...')


def tcplink(sock, addr):
    print('Accept new connection from %s' % addr)
    sock.end(b'Welcome')

    while True:
        data = sock.recv(1024)
        time.sleep(1)
        if not data or data.decode('utf-8') == 'exit':
            break
        sock.send('Hello, %s' % data.decode('utf-8'))

while True:
    sock, addr = s.accept()

    t = threading.Thread(target=tcplink, args=(sock, addr))
    t.start()
