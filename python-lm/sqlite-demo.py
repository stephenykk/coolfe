#!/usr/bin/env python3
# coding: utf-8

import os, sqlite3

db_file = os.path.join(os.path.dirname(__file__), 'test.db')

if os.path.isfile(db_file):
    os.remove(db_file)

conn = sqlite3.connect(db_file)
cursor = conn.cursor()
cursor.execute('create table user(id varchar(20) primary key, name varchar(20), score int)')
cursor.execute(r"insert into user values ('A001', 'Lufy', 99)")
cursor.execute(r"insert into user values ('A002', 'Nami', 92)")
cursor.execute(r"insert into user values ('A003', 'Zoro', 88)")

conn.commit()
cursor.close()
conn.close()

def get_score_in(low, high):
    try:
      conn = sqlite3.connect(db_file)
      cursor = conn.cursor()
      cursor.execute(r"select * from user where score between ? and ? order by score", (low, high))
      result = cursor.fetchall()
      return [row[1] for row in result]
    except:
      print('some error..')
    finally:
        cursor.close()
        conn.close()


print(get_score_in(80, 90))
print(get_score_in(80, 100))
print(get_score_in(94, 99))

