const express = require('express')
const app = express()
const path = require('path')
const resolve = (file) => path.resolve(__dirname, file)

const { getIP } = require('../utils/common')

app.use(express.static('public'))
app.post('/merge', (req, res, next) => {
    res.sendFile(resolve('index.html'))
})

app.post('/build', (req, res) => {

})

app.listen(3000, () => {
    console.log(`本地服务器运行在 http://${getIP()}:3000`);
})