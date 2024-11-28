#!/usr/bin/env python3
# coding: utf-8

# use flask package to create a simple web server

from flask import Flask, request, render_template

# at first, create app object
app = Flask(__name__)


# use decorator @app.route() to bind a function to a url
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


