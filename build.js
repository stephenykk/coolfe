const fs = require("fs");
const path = require("path");
const child_process = require("child_process");
const { rejects } = require("assert");

const pathJoin = path.join

class HomeHtml {
  constructor() {
    this.docsRoot = pathJoin(__dirname, 'docs')
    this.indexMd = pathJoin(__dirname, 'index.md')
    this.files = this.getFiles(this.docsRoot)
  }

  getFiles(dir) {
    let files = fs.readdirSync(dir)
    files = files.filter(file => !/^\./.test(file))
    return files.filter(file => fs.statSync(pathJoin(dir, file)).isFile())
  }

  getLink(file) {
    let fpath = pathJoin(this.docsRoot, file)
    return new Promise((resolve, reject) => {
      fs.readFile(fpath, 'utf8', function(err, con) {
        if(err) return reject(err)
        let firstLine = con.match(/^.*$/m)[0]
        resolve({text: firstLine, url: `./docs/${file}`})
      })
    }) 
  }

  async getLinks() {
    return await Promise.all(this.files.map(this.getLink, this))
  }

  async updateIndexMd() {
    let links = await getLinks();
  
    let linksMarkdown = links.map(link => {
      return `+ [${link.text}](${link.url})`;
    });
  
    let con = fs.readFileSync(this.indexMd, "utf8");
    const re = /(<!-- links -->)[\s\S]*/gim;
    con = con.replace(re, "$1\r\n" + linksMarkdown.join("\r\n"));
  
    fs.writeFileSync(this.indexMd, con, "utf8");
  
    return true;
  }

  async start() {
    try {
      await this.updateIndexMd();
  
      // index.md -> index.html
      let result = child_process.execSync("markdown-html index.md -o index.html");
      console.log('\r\n\r\n');
  
      console.log("index.md -> index.html done..");
    } catch (e) {
      console.log("err:", e);
    }
  }

}

new HomeHtml().start()