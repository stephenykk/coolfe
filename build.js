const fs = require("fs");
const child_process = require("child_process");
const path = require("path");

let docsDir = path.resolve(__dirname, "./docs");

async function getLinks() {
  let files = fs.readdirSync(docsDir);
  console.log("-----------> files:", files);
  console.log();
  console.log();

  files = files.filter(file => {
    let stat = fs.statSync(path.resolve(docsDir, file));
    return !stat.isDirectory();
  });

  let links = [];


  for (let i = 0; i < files.length; i++) {
    let link = await new Promise(resolve => {
      let file = files[i];
      let con = fs.readFileSync(path.join(docsDir, file));
      let firstLine = /^.*$/m.exec(con)[0];
      resolve({
        url: `./docs/${file}`,
        text: firstLine
      });
    });

    links.push(link);
  }
  
  console.log("------------>links:", links);       
  
  return links;
}

async function write(fpath) {
  let links = await getLinks();

  let linksMarkdown = links.map(link => {
    return `+ [${link.text}](${link.url})`;
  });

  let con = fs.readFileSync(fpath, "utf8");
  const re = /(<!-- links -->)[\s\S]*/gim;
  con = con.replace(re, "$1\r\n" + linksMarkdown.join("\r\n"));

  fs.writeFileSync(fpath, con, "utf8");
  return true;
}

async function main() {
  try {
    await write("index.md");

    // index.md -> index.html
    let result = child_process.execSync("markdown-html index.md -o index.html");
    console.log();
    console.log();

    console.log("index.md -> index.html done..");
  } catch (e) {
    console.log("err:", e);
  }
}

main();
