const express = require('express')
const app = express()
const path = require('path')
const resolve = (file) => path.resolve(__dirname, file)

const os = require('os')
function getIP() {
    const cardInfos = os.networkInterfaces()
    for (card in cardInfos) {
        if (['WLAN', '本地连接', '以太网'].includes(card)) {
            const infos = cardInfos[card]
            const info =infos.find(info => info.family === 'IPv4')
            return info.address
        }
    }
    return 'localhost'
}


app.get('/', (req, res, next) => {
    res.sendFile(resolve('index.html'))
})

app.listen(3000, () => {
    console.log(`本地服务器运行在 http://${getIP()}:3000`);
})