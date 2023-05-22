const express = require('express')
const app = express()
const path = require('path')
const resolve = (file) => path.resolve(__dirname, file)

const { getIP, spawnChild } = require('../utils/common')

app.use(express.static('public'))
app.get('/mytest', (req, res) => {
    res.setHeader('content-type', 'text/html; charset=utf-8')
    res.write('<html><body><pre>')


    // spawnChild('bash', ['a.sh'], data => res.write(data), data => {
    spawnChild('ping', [ '-n', '20', 'www.baidu.com'], data => res.write(data), data => {
        res.write(data)
        res.end('</pre></body></html>')
        // res.end()
    })

})


app.post('/merge', (req, res, next) => {
    res.sendFile(resolve('index.html'))
})

app.post('/build', (req, res) => {

})

app.listen(3000, () => {
    console.log(`本地服务器运行在 http://${getIP()}:3000`);
})