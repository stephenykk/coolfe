const fs = require("fs")
const path = require('path')
const spawn = require('child_process').spawn
const child_process = require('child_process')

const express = require('express')
const app  = express()

// const buf = child_process.spawnSync('ping', ['-n', '10', 'wwww.baidu.com'])
// const buf = child_process.spawnSync('ping', ['cn.bing.com'])
// console.log("🚀 ~ file: test.js ~ line 10 ~ buf", buf)

// console.log("🚀 ~ file: test.js ~ line 11 ~ buf.stdout", buf.stdout.toString())

// return

const log = (...args) => console.log(':::log:', ...args)
function spawnChild(cmd, args = [], dataCb = console.log, doneCb=console.log) {

    const child = spawn(cmd, args)
    const chunks = []
    const errChunks = []
    const cons = []
    let error = ''
    child.stdout.on('data', data => {
        log('stdout-->', data.toString())
        // chunks.push(data)
        dataCb(data.toString())
    })

    
    child.stderr.on('data', (data) => {
        log('stderr-data-->', data.toString())
        // errChunks.push(data)
        dataCb(data.toString())
    })

    child.stdout.on('end', () => {
        const outCon = Buffer.concat(chunks).toString()
        log('stdout-end-->', 'data finish:: \n\n', outCon)
        // cons.push(outCon)
        // doneCb()

    })

    child.stderr.on('end', () => {
        const errCon = Buffer.concat(errChunks).toString()
        log('stderr-end-->', 'data finish:: \n\n', errCon)
        // cons.push(errCon)
        dataCb(err.message + err.stack)
    })

    // child.stderr.on('data', log.bind(console, 'stderr-data-->'))

    child.on('error', (err) => {
        log('child got error:', err)
        log('err.stack:', err.stack, typeof err.stack)
        error = err
        // cons.push(error)
        cons.push(err.message, err.stack)
    })
    
    // child.on('close', (code) => {
    //     log('cmd close', code)
    //     cb(cons)
    // })


    child.on('exit', (code) => {
        log('cmd exit', code)
        cb(cons)
    })

    return child
}

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
    res.setHeader('content-type', 'text/html; charset=utf-8')
    const cb = (cons) => {
        const html = `<html><body><pre>${cons.join('\n')}</pre></body></html>`
        res.end(html)
    }

    // spawnChild('xping', ['-n', '10', 'www.baidu.com'], cb)
    spawnChild('ping', ['-n', '10', 'www.baidu.com'], cb)
})

app.listen(3000, () => {
    log('server running on: http://localhost:3000')
})