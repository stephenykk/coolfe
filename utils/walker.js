// 遍历目标文件夹，对满足条件的文件执行操作

const fs = require('fs')
const path = require('path')


class Walker {
    constructor(options = {}) {
        this.root = path.resolve(options.root || __dirname)
        this.blackList = options.blackList || ['node_modules']
        this.check = options.check || function() {return true}
        this.callback = options.callback || console.log
    }

    divide(arr, callback) {
        let ypart = []
        let npart = []
        arr.forEach((val, i) => {
            let part = [npart, ypart][callback(val, i) * 1]
            part.push(val)
        })
        return [ypart, npart]
    }

    walk(root) {
        root = root

        let files = fs.readdirSync(root)

        let dotfileRe = /^\./
        files = files.filter(fname => !dotfileRe.test(fname))

        let [dirnames, fnames] = this.divide(files, fname => fs.statSync(path.resolve(root, fname)).isDirectory())

        fnames.forEach(fname => {
            let fpath = path.resolve(root, fname)
            this.check(fname, fpath) && this.callback(fpath)
        })

        dirnames = dirnames.filter(dirname => !this.blackList.includes(dirname))

        dirnames.forEach(dir => {
            let dpath = path.resolve(root, dir)
            this.walk(dpath)
        })

    }

    start() {
        this.walk(this.root)
    }
}

module.exports = Walker