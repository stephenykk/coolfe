#!/usr/bin/env python3
# coding: utf-8

from email import encoders
from email.header import Header
from email.mime.text import MIMEText
from email.utils import parseaddr, formataddr
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase

import smtplib

def _format_addr(s):
    name, addr = parseaddr(s)
    return formataddr((Header(name, 'utf-8').encode(), addr))

from_addr = input('From:')
password = input('Password:')
to_addr = input('To:')
smtp_server = input('SMTP server:')

# msg = MIMEText('hello, kk', 'pain', 'utf-8')
msg = MIMEMultipart()
msg['From'] = _format_addr('Python爱好者 <%s>' % from_addr)
msg['To'] = _format_addr('Admin <%s>' % to_addr)
msg['Subject'] = Header('来自明天的消息', 'utf-8').encode()
msg.attach(MIMEText('send with file..', 'plain', 'utf-8'))

with open('/home/pan/Pictures/d.webp', 'rb') as f:
    mime = MIMEBase('image', 'webp', filename='cute.webp')
    mime.add_header('Content-Disposition', 'attachment', filename='cute.webp')
    mime.add_header('Content-ID', '<0>')
    mime.add_header('X-Attachment-ID', '0')

    mime.set_payload(f.read())
    encoders.encode_base64(mime)
    msg.attach(mime)





server = smtplib.SMTP(smtp_server, 25)
server.set_debuglevel(1)
server.login(from_addr, password)
server.sendmail(from_addr, [to_addr], msg.as_string())

server.quit()


