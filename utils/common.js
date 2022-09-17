const os = require('os')
const child_process = require('child_process')
const shell = 'C:\\Program Files\\Git\\git-bash.exe'


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

function createLog (prefix = 'LOG') {
    return (...args) => console.log(`[${prefix}]`, ...args)
}

function spawnChild(cmd, args = [], dataCb = console.log, doneCb=console.log) {
    const log = createLog('spawn child')
    const child = child_process.spawn(cmd, args, {shell, maxBuffer: 10 * 1024 * 1024})
 
    child.stdout.on('data', data => {
        log('stdout-data >>', data.toString())
        dataCb(data.toString())
    })

    
    child.stderr.on('data', (data) => {
        log('stderr-data >>', data.toString())
        dataCb(data.toString())
    })

    child.stdout.on('end', () => {
        // const outCon = Buffer.concat(chunks).toString()
        log('stdout-end !!')
    })
    
    child.stderr.on('end', () => {
        // const errCon = Buffer.concat(errChunks).toString()
        log('stderr-end !!')
    })

    child.on('error', (err) => {
        log('child got error >>', err)
        doneCb(err.message + err.stack)
    })
    
    // child.on('close', (code) => {
    //     log('cmd close', code)
    //     cb(cons)
    // })


    child.on('exit', (code) => {
        log('cmd exit', code)
        // cb(cons)
        doneCb('EXIT CODE IS :' + code)
    })

    return child
}


module.exports = { getIP, createLog, spawnChild }