// 备份手机相片到移动硬盘

const fs = require('fs')
const path = require('path')
const child_process = require('child_process')
const readline = require('readline')

const Walker = require('../utils/walker')

class BackPhotos {
	constructor(options = {}) {
		this.indexFile = options.indexFile || path.resolve(__dirname, 'index.json')
		this.roots = [__dirname]
		this.photos = []
	}

	createIndexFile() {
		let options = {
			skipFileList = [/^(\.|\$)/, /\.(js|json|txt)$/, /thumbs/i],
			skipDirList = [/system/i, /node_modules/, /^(\.|\$)/],
			callback: (fpath) => {
				this.photos.push(fpath)
			}
		}
		
		var walker = new Walker(options)

		for(let root of this.roots) {
			walker.root = path.resolve(root)
			walker.start()
		}

		this.outputIndex()
	}

	outputIndex(isUpdate) {
		
		fs.writeFileSync(this.indexFile, JSON.stringify(this.photos), 'utf8')
		fs.writeFileSync(this.indexFile.replace(/\.json$/, 'Date.json'), JSON.stringify({date: Date.now()}), 'utf8')

		this.log(`${isUpdate ? 'UPDATED' : 'CREATED'} INDEX FILE:`, this.indexFile)
	}

	initReadLine(isExistsPath) {
		const rl = readline.createInterface({input: process.stdin, output: process.stdout})

		rl.on('close', code => {
			process.exit(0)
		})

		if(isExistsPath) {
			rl.question('之前已复制，按任意键退出', answer => {
				rl.close()
			})
			return
		}

		rl.question('复制到移动硬盘？1：MY照片，2：MY照片2，3：MY视频，4：MY视频2 回车:不选择 请选择：', answer => {
			let drivers = ['', 'J:', 'I:', 'M:', 'L:']
			let driver = drivers[answer]

			if(!answer) {
				this.log2('没有选择目标位置, 即将退出..')
				setTimeout(rl.close.bind(rl), 1000)
				return
			}

			this.log('请耐心等待...')

			let destPath = this.getDestPath(driver)
			this.copy(this.searchPath, destPath, this.copyCallback.bind(this, rl, destPath))

		})
	}

	copy(from, to, callback) {
		
		let isWin = process.platform.match(/win/)
		if(isWin) {
			// windows下没有cp命令 所以用xcopy代替
			// 文件夹复制 目标路径要以\结尾
			if(!/\\/.test(to)) {
				to += '\\'
			}	
		}

		this.log2(`开始复制 ...`)

		let copyPro
		if(isWin) {
			copyPro = child_process.spawn('xcopy', ['/SYF', from , to], {cwd: __dirname})

		} else {
			copyPro = child_process.spawn('cp', ['-rf', from , to], {cwd: __dirname})
		}

		copyPro.stdout.on('data', data => this.log('STDOUT', data.toString()))
		copyPro.stderr.on('data', data => this.log('STDERR', data.toString()))

		copyPro.on('close', code => {
			if(code !== 0) {
				this.log(`复制异常 code -> ${code}： ${from} --> ${to}`)
				return
			}

			this.log2(`复制成功： ${from} --> ${to}`)

			callback && callback()
		})
	}

	copyCallbck(rl, destPath) {
		let newPath = destPath
		if(this.isFileSearch) {
			newPath = path.join(destPath, path.basename(this.searchPath))
		}

		this.photos.push(newPath)
		this.outputIndex(true)

		this.log2('5秒后将退出...')
		setTimeout(rl.close.bind(rl), 5000)
	}

	getDestPath(driver) {
		let destPath = this.searchPath.replace(/^[a-z]:/i, driver)
		
		if(this.isFileSearch) {
			destPath = path.join(destPath, '..')
		}

		return destPath
	}

	log2(...args) {
		console.log('\n', ...args, '\n')
	}

	log(...args) {
		console.log('::', ...args)
	}

	checkExist() {

		let foundPath = this.photos.find(cachePath => {
			// 数码相机拍的照片名称形如: IMG_8839.JPG, 不断的重新拍，可能重名
			// 所以查找文件时，若有同名文件，还要进一步确认大小相同，才判断为已存在

			if(this.isFileSearch) {
				let fname = path.basename(this.searchPath)
				if(cachePath.include(fname)) {
					let [astat, bstat] = [fs.statSync(cachePath), fs.statSync(this.searchPath)]
					return astat.size === bstat.size
				}
				return false
			} else {
				return cachePath === this.searchPath
			}
		})

		if (foundPath) {
			this.log(`SUCCESS 移动硬盘已存有该文件${this.isFileSearch ? '' : '夹'}:`, foundPath)
		} else {
			this.log(`FAIL 移动硬盘没有该文件${this.isFileSearch ? '' : '夹'}`, this.searchPath)
		}

		this.initReadLine(!!foundPath)
	}

	getPhotos() {
		let exists = fs.existsSync(this.indexFile)
		if(exists) {
			this.photos = require('./index.json')
		} else {
			this.createIndexFile()
		}
	}

	start() {
		this.searchPath = process.argv[2]
		if(!this.searchPath) {
			this.log2('缺少searchPath, 请检查参数')
			return;
		}


		let isFile = fs.statSync(path.resolve(this.searchPath)).isFile()
		this.isFileSearch = isFile

		this.getPhotos()
		this.checkExist()
	}

	init() {
		let isIndex = process.argv[2] === 'true'
		isIndex ? this.createIndexFile() : this.start()
	}
}