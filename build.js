const fs = require("fs");
const path = require("path");
const child_process = require("child_process");

const pathJoin = path.join

class HomeHtml {
  constructor() {
    this.docsRoot = pathJoin(__dirname, 'docs')
    this.indexMd = pathJoin(__dirname, 'index.md')
    this.files = this.getFiles(this.docsRoot)
  }

  dateFormat(date, isTime = true) {
    let dparts  = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    let tparts = [date.getHours(), date.getMinutes(), date.getSeconds()]
    
    return dparts.join('-') + (isTime ? ' ' + tparts.join(':') : '')
  }

  getFiles(dir) {
    let files = fs.readdirSync(dir)
    files = files.filter(file => !/^\./.test(file))
    return files.map(file => {
      let stat = fs.statSync(pathJoin(dir, file))
      let isFile = stat.isFile();
      if(!isFile) {
        return false
      } else {
        let date = this.dateFormat(stat.mtime)
        return [file, date]
      }
    })
  }

  getLink(fileInfo) {
    let [file, date] = fileInfo
    let fpath = pathJoin(this.docsRoot, file)
    return new Promise((resolve, reject) => {
      fs.readFile(fpath, 'utf8', function(err, con) {
        if(err) return reject(err)
        let firstLine = con.match(/^.*$/m)[0].replace('#', '').trim()
        resolve({date, text: firstLine, url: `./docs/${file.replace(/\.md$/, '.html')}`})
      })
    }) 
  }

  async getLinks() {
    let links = await Promise.all(this.files.map(this.getLink, this))
    links.sort((a, b) => {
      var al = a.text.split('')
      var bl = b.text.split('')
      var r = 0;
      al.findIndex((c, j) => {r = c.charCodeAt(0) - (bl[j] || '').charCodeAt(0); return r})
      return r
    })
    return links
  }

  async updateIndexMd() {
    let links = await this.getLinks();
    // console.log(links.map(l => l.text));
  
    let linksMarkdown = links.map(link => {
      return `+ [${link.text}](${link.url})<time>${link.date}</time>`;
    });
  
    let con = fs.readFileSync(this.indexMd, "utf8");
    const re = /(<!-- links-start -->)[\s\S]*(<!-- links-end -->)/gim;
    con = con.replace(re, "$1\r\n" + linksMarkdown.join("\r\n")+'\r\n$2');
  
    fs.writeFileSync(this.indexMd, con, "utf8");
  
    return true;
  }

  async create() {
    console.log('creating.......')
    try {
      await this.updateIndexMd();
  
      // index.md -> index.html
      let result = child_process.execSync("markdown-html index.md -o index.html -l template.html");
      console.log('\r\n\r\n');
  
      console.log("index.md -> index.html done..");
    } catch (e) {
      console.log("err:", e);
    }
  }

}

new HomeHtml().create()