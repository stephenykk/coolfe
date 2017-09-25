const fs = require('fs');
const path = require('path');


function write (fpath) {
    function getLinks() {
        let files = fs.readdirSync('./docs');
        console.log(files, '<--');
        let links = files.map(file => {
            let con = fs.readFileSync(path.join('./docs', file))
            let firstLine = /^.*$/m.exec(con)[0];
            return {url: './docs/file', text: firstLine};
        });
        return links;
    }

    let links = getLinks();
    let linksMarkdown = links.map(link => {
        return `+ [${link.text}](${link.url})`;
    });
    let con = fs.readFileSync(fpath, 'utf8');
    const re = /(<!-- links -->)[\s\S]*/img;
    con = con.replace(re, '$1\r\n'+linksMarkdown);
    fs.writeFileSync(fpath, con, 'utf8');
    return true;
}


const child_process = require('child_process');
try {
    write('index.md');
    let result = child_process.execSync('markdown-html index.md -o index.html');
    console.log('index.md -> index.html done..');
}catch(e) {
    console.log('err:', e);
}



