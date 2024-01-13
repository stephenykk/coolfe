# github page notes

[在GitHub Page上部署网页 - 简书](https://www.jianshu.com/p/5f3effb3eaad)

## github page site types
- 项目的站点  
  默认发布 `gh-pages` 分支的内容, 可配置发布 master 分支，或 mater 分支下的 docs 文件夹
  访问 `http(s)://<user>.github.io/<repository>`
- 个人的站点  
  创建同名仓库 `<user>.github.io`   
  默认发布 `master` 分支的内容   
  访问 `http(s)://<user>.github.io/`
- 组织的站点  
  创建同名仓库 `<organization>.github.io`  
  默认发布 `master` 分支的内容   
  访问 `http(s)://<organization>.github.io/`


## static site generators
[About GitHub Pages and Jekyll - GitHub Docs](https://docs.github.com/en/github/working-with-github-pages/about-github-pages-and-jekyll)

## jekyll
jekyll会自动转换markdown为html文件，直接访问即可。
```js
// http://stephenykk.github.io/coolfe/docs/test.md
// -> 
// http://stephenykk.github.io/coolfe/docs/test.html
```
