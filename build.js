const fs = require('fs');
const path = require('path');


function write (fpath) {
    let links = '+ aaa \r\n+ bbb';
    let con = fs.readFileSync(fpath, 'utf8');
    const re = /(<!-- links -->)[\s\S]*/img;
    con = con.replace(re, '$1\r\n'+links);
    fs.writeFileSync(fpath, con, 'utf8');
    return true;
}


const child_process = require('child_process');
try {
    write('index.md');
    var result = child_process.execSync('markdown-html index.md -o index.html');
    console.log('index.md -> index.html done..');
}catch(e) {
    console.log('err:', e);
}



