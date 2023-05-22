#!/usr/bin/env python3
# coding: utf-8

from flask import Flask, request, render_template

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def home():
    return render_template('home.html')

@app.route('/signin', methods=['GET'])
def sign_form():
    return render_template('form.html')

@app.route('/signin', methods=['POST'])
def signin():
    user = request.form['username']
    password = request.form['password']

    if user  == 'admin' and  password == '123':
        return render_template('sign-ok.html', user=user) 
    else:
        return render_template('form.html', message='bad user or pwd', user=user) 



if __name__ == '__main__':
    app.run()


