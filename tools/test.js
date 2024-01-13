const fs = require("fs")
const path = require('path')
const spawn = require('child_process').spawn
const child_process = require('child_process')

const { createLog, spawnChild } = require('../utils/common')

const express = require('express')
const app  = express()

const log = createLog('test')

// const buf = child_process.spawnSync('ping', ['-n', '10', 'wwww.baidu.com'])
// const buf = child_process.spawnSync('ping', ['cn.bing.com'])
// console.log("🚀 ~ file: test.js ~ line 10 ~ buf", buf)

// console.log("🚀 ~ file: test.js ~ line 11 ~ buf.stdout", buf.stdout.toString())

// return


// const child = spawnChild('ls', ['-hl', 'xxss'])
// const child = spawnChild('date', ['+%Y%m%d'])
// const child = spawnChild('which', ['node'])

// const child = spawnChild('xping', ['-n', '10', 'www.baidu.com'])


function runCmd(cmd, cb) {
    child_process.exec(cmd, (err, stdout, stderr) => {
        log('stdout==>', stdout.toString())
        log('stderr==>', stderr.toString())
    })

}

// runCmd('ping -n 10 www.baidu.com')

// const r = path.resolve('f:\\movie')
// const con = fs.readFileSync('f:\\movie\\hi.txt', { encoding: 'utf8'})

// console.log("🚀 ~ file: test.js ~ line 20 ~ con", con)

// console.log("🚀 ~ file: test.js ~ line 4 ~ r", r)

app.get('/', (req, res, next) => {
    const preHtml = `<html><body><pre>`
    const postHtml = `</pre></body></html>`
    res.setHeader('content-type', 'text/html; charset=utf-8')
    res.write(preHtml)

    const dataCb = (data) => {
        res.write(data)
    }
    const doneCb = (data) => {
        data && res.write(data)
        res.write(postHtml)
        res.end()
    }

    // spawnChild('xping', ['-n', '10', 'www.baidu.com'], cb)
    // spawnChild('ping', ['-n', '10', 'www.baidu.com'], dataCb, doneCb)
    spawnChild('./a.sh', [], dataCb, doneCb)
    // spawnChild('echo', ['foo', 'good/z'], dataCb, doneCb)
})

app.listen(3000, () => {
    log('server running on: http://localhost:3000')
})