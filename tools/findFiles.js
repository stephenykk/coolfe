var fs = require('fs');
var path = require('path');
var root = process.argv[2] || '.';

var blackList = ['node_modules'];
var extRe = /\.\w{2,5}$/;
var spaceRe = /\s/;
var dotfileRe = /^\./;

function printJsonFile(fpath) {
    if(fpath.match(/\.json$/)) {
        console.log('---------->', fpath);
    } else {
        console.log('    ', fpath)
    }
}

function walk(root, cb, level = 0) {
    if(level > 6) return;


    var files = fs.readdirSync(path.resolve(root));
    files = files.filter(f => !blackList.includes(f) && !spaceRe.test(f) && !dotfileRe.test(f));

    var folders = files.filter(f => !extRe.test(f));
    var files = files.filter(f => extRe.test(f));

    files.forEach(f => cb(path.resolve(root, f)));

    folders.forEach(folder => {
        var folderPath = path.resolve(root, folder);
        let stat = fs.statSync(path.resolve(root, folder))
        if(stat.isDirectory(folderPath)) {
            walk(folderPath, cb, level++);
            
        } else {
            console.log('::like folder, but not:', folderPath);
        }
    })
}

walk(root, printJsonFile);