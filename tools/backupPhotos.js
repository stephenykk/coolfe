var fs = require('fs');
var path = require('path');
var Emitter = require('events').EventEmitter
var readline = require('readline')
var child_process = require('child_process')

class Walker {
	/**
	 * @param  {option = {blackList, callback, rootDirs}}
	 * @return {walker}
	 */
	constructor(options = {}) {
		let defOptions = {
			blackList: ['.', '..', /^\$/, /system/i, /\.(js|txt)$/, 'Thumbs.db'],
			outputFile: '',
			rootDirs: [],
			callback: console.log
		}

		Object.assign(this, defOptions, options)

		if (this.outputFile) {
			this.outputFile = path.resolve(__dirname, this.outputFile)
		}

		this.count = 0
		this.doneCount = 0
		this.emitter = new Emitter()
	}

	notInBlackList(fname) {
		return !this.blackList.some(bitem => typeof bitem === 'string' ? bitem === fname : bitem.test(fname))
	}

	walk(dir) {
		console.log();
		console.log('------> WALKING DIR:', dir)

		var files = fs.readdirSync(dir) || []
		files = files.filter(this.notInBlackList.bind(this))
		var subFiles = files.filter(fname => {
			let fpath = path.join(dir, fname);
			let stat = fs.statSync(fpath)
			return !stat.isDirectory()
		});
		var subDirs = files.filter(fname => !subFiles.includes(fname));

		subFiles.forEach(subFile => {
			this.count++
				this.callback(path.join(dir, subFile))
		});

		subDirs.forEach(subDir => {
			this.walk(path.join(dir, subDir))
		});
	}

	createIndex(isFinding) {
		this.isFinding = isFinding
		this.rootDirs.forEach(rootDir => {
			console.log();
			console.log();
			console.log('---> START WALK ROODIR:', rootDir)
			console.log();

			this.walk(rootDir);
		});
	}

	clearIndex() {
		let err = fs.writeFileSync(this.outputFile, ['J:\\example\\placeholder.jpg'], 'utf8');
		if(err) {
			console.warn('清除 outputFile 异常:', err)
		} else {
			console.log('清除 outputFile 成功')
		}
	}


	getLastWalkDate() {
		let exists = fs.existsSync(this.outputFile)
		if(!exists) return false

		let stat = fs.statSync(this.outputFile)
		let date = new Date(stat.mtime)
		return date.toLocaleDateString()
	}

	hasWalkedToday() {
		let today = new Date()
		today = today.toLocaleDateString()

		let lastDate = this.getLastWalkDate()

		if(!lastDate) return false

		return lastDate === today
	}

	isFile(fpath) {
		return /\.\w{2,5}/.test(fpath)
	}

	doFind(searchFpath) {
		let sfile = path.basename(searchFpath)
		let isFile = this.isFile(sfile)
		let foundFpath = this.fileList.find(fpath => {
			// 数码相机拍的照片名称形如: IMG_8839.JPG, 不断的重新拍，可能重名
			// 所以查找文件时，若有同名文件，还要进一步确认大小相同，才判断为已存在
			if(isFile) {

				if(fpath.includes(sfile)) {
					let sStat = fs.statSync(searchFpath)
					let fStat = fs.statSync(fpath)
					return sStat.size === fStat.size;
				} else {
					return false;
				}
			} else {
				return fpath.includes(`\\${sfile}\\`)
			}
		})

		console.log()
		if (foundFpath) {
			console.log(`SUCCESS 移动硬盘已存有该文件${isFile ? '' : '夹'}:`, foundFpath)
		} else {
			console.warn(`FAIL 移动硬盘没有该文件${isFile ? '' : '夹'}`, searchFpath)
		}
		console.log()

		this.emitter.emit('finddone', foundFpath)
	}


	find(searchFpath) {
		if (!searchFpath) {
			console.log('NOT SEARCH FILE SPECIFIY')
			return false;
		}

		if (this.hasWalkedToday()) {
			var con = fs.readFileSync(this.outputFile, 'utf8')
			if (!con) {
				console.warn('找不到文件', this.outputFile)
				return
			}

			this.fileList = con.split(/\r\n/);
			this.doFind(searchFpath)


		} else {
			this.createIndex(true)
			this.emitter.on('finish', this.doFind.bind(this, searchFpath))

		}
	}

}

function getFilePaths(fpath) {
	this.fileList = this.fileList || []

	this.fileList.push(fpath)
	console.log(fpath);

	this.doneCount++

		clearTimeout(this.timer)
	this.timer = setTimeout(() => {
		if (this.doneCount === this.count) {

			fs.writeFileSync(this.outputFile, this.fileList.join('\r\n'), 'utf8')
			this.emitter.emit('finish', this.fileList)

			if(!this.isFinding) {
				console.log();
				console.log();
				console.log('ALL DONE');
				console.log('OUTPUT FILE: picAndVideoPathes.txt')
			} else {
				this.isFinding = false
			}
		}

	}, 3000);
}



function main() {
	var walker = new Walker({
		rootDirs: ['I:\\', 'J:\\', 'L:\\', 'M:\\'],
		// rootDirs: ['I:\\'],
		callback: getFilePaths,
		outputFile: 'photoAndVideoPathes.txt'
	})

	let param = process.argv[2]
	// param = 'E:\\helloDir'

	if (!param) {
		console.warn('缺少参数')
		return
	}

	// param = 'I:\\meizuPhone\\photos\\P70624-095900.jpg'
	// param = 'E:\\meizuPhotos2'

	console.log('param:', param)
	if (param === 'index') {
		console.log('BEFORE CREATING INDEX')
		walker.createIndex()
	} else if(param === 'clearIndex') {
		walker.clearIndex()
	}else {

		let searchFpath = param
		walker.emitter.on('finddone', (foundFpath) => {
			let rl = readline.createInterface({
				input: process.stdin,
				output: process.stdout
			})

			if(foundFpath) {
				rl.question('按回车退出', answer => {
					rl.close()
				});

			} else {
				rl.question('复制到移动硬盘？1：MY照片，2：MY照片2，3：MY视频，4：MY视频2 回车:不选择 请选择：', answer => {
					if(!answer) {
						console.warn('没有选择目标位置, 即将退出..')
						setTimeout(() => rl.close(), 1000)
						return;
					}

					console.log('若文件较多，会有点慢，请耐心等待')

					let fname = path.basename(searchFpath) // file name or last dir name
					let driver = ['', 'J:', 'I:', 'M:', 'L:'][answer]	

					// let destFpath = path.join(driver, fname)
					
					let isFile = walker.isFile(searchFpath)
					let destFpath = searchFpath.replace(/^[a-z]:/i, driver) // 不管复制的是文件还是文件夹 目标路径都应该是目录
					if(isFile) {
						destFpath = path.join(destFpath, '..');
					}


					linuxCP(searchFpath, destFpath, () => {
						// 更新outputFile
						if(walker.isFile(searchFpath)) {
							let fname = path.basename(searchFpath)
							destFpath = path.join(destFpath, fname);
						}

						walker.fileList.push(destFpath)
						let err = fs.writeFileSync(walker.outputFile, walker.fileList.join('\r\n'), 'utf8')
						
						if(err) {
							console.warn('更新outputFile异常', err)
						}

						console.log('5秒后将退出')
						setTimeout(() => rl.close(), 5000);
					});
				})
			}


			rl.on('close', code => {
				process.exit(0)
			});


			rl.on('close', code => {
				process.exit(0)
			});
		});

		walker.find(searchFpath);
	}
}



function linuxCP(from, to, cb) {
	// from = from.replace(/\\/g, '/')
	// to = to.replace(/\\/g, '/')
	let fileRe = /\.\w{2,5}$/
	let isFile = fileRe.test(from)

	let cmd = `cp -rf ${from} ${to}`

	// !isFile && !/\\$/.test(to) && (to += '\\') // 文件夹复制 目标路径要以\结尾
	!/\\$/.test(to) && (to += '\\') // 文件夹复制 目标路径要以\结尾
	cmd = `xcopy /SYF ${from} ${to}` // windows下没有cp命令 所以用xcopy代替

	console.log()
	console.log('开始执行命令:' , cmd, '     .... ')


	// --------------------------------

	var xcopy = child_process.spawn('xcopy', ['/SYF', from , to], {cwd: __dirname})
	xcopy.stdout.on('data', data => {
		console.log('[stdout]', data.toString('utf8'))
	});
	xcopy.stderr.on('data', data => {
		console.warn('[stderr]', data.toString('utf8'))
	});
	xcopy.on('close', (code) => {
		if(code !== 0) {
			console.warn(`复制异常 code -> ${code}： ${from} --> ${to}`)
			return
		}

		console.log()
		console.warn(`复制成功： ${from} --> ${to}`)

		cb && cb()
	})

	// --------------------------------

  //   child_process.exec(cmd, {cwd: __dirname}, (err, stdout, stderr) => {
  //   // child_process.exec(`xcopy /S ${from} ${to}`, (err, stdout, stderr) => {
  //   	if(err) {
  //   		console.warn(`复制异常： ${from} --> ${to}`)
  //   		console.log(err)
  //   		// throw err;

  //   		return
  //   	}

  //   	// console.log('stdout:', stdout)
  //   	// console.log('stderr:', stderr)

  //   	console.log()
		// console.warn(`复制成功： ${from} --> ${to}`)

		// cb && cb()
  //   });    
}


main()

// linuxCP('E:\\helloDir', 'J:\\hello5')


