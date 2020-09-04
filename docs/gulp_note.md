# gulp notes

## 简介
Gulp 是一个基于 Node.js 的开源前端工作流构建工具

Gulp 的设计核心是基于流的方式，将文件转化为抽象的流，然后通过管道的方式将任务串联起来，基于流的方式让任务处理都保存在内存当中，没有临时文件，能够提升构建的性能。

## 安装

```bash
  npm i -g gulp # 全局安装
  npm i gulp -save-dev
```

## gulpfile.js

```js
var gulp = require('gulp')
gulp.task('default', function(done) {
  console.log('hello gulp')
  callback() // 通知gulp，任务完成
})
```
## 执行
命令行切换到项目根目录，执行 `gulp` 即可

## 任务
task 的执行是异步的，可以基于回调函数 或 promise 或 stream 等方式通知任务完成

```js
// 回调函数

var del = require('del');
// 传入 done  回调函数
gulp.task('clean', function(done) {
  del(['.build/'], done);
});


// promise

var Promise = require('promise');
var del = require('del');

gulp.task('clean', function() {
  return new Promise(function (resolve, reject) {
    del(['.build/'], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
});

// stream

gulp.task('somename', function() {
  return gulp.src('client/**/*.js')
    .pipe(minify())
    .pipe(gulp.dest('build'));
});

// 子进程

gulp.task('clean', function() {
  return spawn('rm', ['-rf', path.join(__dirname, 'build')]);
});
```

## 示例

```js
var gulp = require('gulp');
var less = require('gulp-less');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var del = require('del');

var paths = {
  styles: {
    src: 'src/styles/**/*.less',
    dest: 'assets/styles/'
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'assets/scripts/'
  }
};

/**
 * 并非所有的任务都是基于流，例如删除文件
 * 一个 gulpfile 只是一个 Node 程序，在 gulpfile 中可以使用任何 npm 中的模块或者其他 Node.js 程序
 */
function clean() {
  // del 也可以和 `gulp.src` 一样可以基于模式匹配的文件路径定义方式 
  return del([ 'assets' ]);
}

/*
 * 通过 Javascript 函数的方式定义任务
 */
function styles() {
  return gulp.src(paths.styles.src)
    .pipe(less())
    .pipe(cleanCSS())
    // 传递一些配置选项到 stream 中
    .pipe(rename({
      basename: 'main',
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.styles.dest));
}

/**
 * 编译 coffee 文件，然后压缩代码，然后合并到 all.min.js
 * 并生成 coffee 源码的 sourcemap
 */
function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest));
}

/**
 * 监控文件，当文件改变过后做对应的任务
 * @return {[type]} [description]
 */
function watch() {
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.src, styles);
}

/*
 * 使用 CommonJS `exports` 模块的方式定义任务
 */
exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;

/*
 * 确定任务是以并行还是串行的方式定义任务
 */
var build = gulp.series(clean, gulp.parallel(styles, scripts));

/*
 * 除了 export 的方式，也可以使用 gulp.task 的方式定义任务
 */
gulp.task('build', build);

/*
 * 定义默认任务，默认任务可以直接通过 gulp 的方式调用
 */
gulp.task('default', build);
```

## API

### `gulp.src()`
```js
/**
 * @param globs [String | Array]
 * @param options [Object {
 *          // 默认: process.cwd()
 *          // 描述: 工作目录
 *          cwd: String,   
 *          
 *          // 默认：在模式匹配之前的路径 a/b/**/*.js base路径为 a/b/
 *          // 描述：gulp.dest 目录会添加 base 目录
 *          base: String | Number,
 *          ...
 * }]
 */
gulp.src(globs[, options])
```

`gulp.src()`方法是流的入口，方法返回的结果为一个 Vinyl files 的 node stream ，可以被 piped 到别的插件中。

```js
// globs：
// ‘src/*.js'
// 'src/**/*.js'
// 'src/{d1/*.js, *.js}'
gulp.src('client/templates/*.jade')
  .pipe(jade())
  .pipe(minify())
  .pipe(gulp.dest('build/minified_templates'));
```

### `gulp.dest()`
```js
/**
 * @param path [String]
 * @param options [Object {
 *          // 默认: process.cwd()
 *          // 描述: 如果提过的 output 目录是相对路径，会将 cwd 作为 output 目录
 *          cwd: String,   
 *          
 *          // 默认：file.stat.mode
 *          // 描述：文件的八进制权限码如 "0744", 如果没有回默认进程权限
 *          mode: String | Number,
 *          
 *          // 默认：process.mode
 *          // 描述：目录的八进制权限码
 *          dirMode: String | Number,
 *
 *          // 默认：true
 *          // 描述：相同路径如果存在文件是否要被覆盖
 *          overwrite： Boolean
 *          ....
 * }]
 */
gulp.dest(globs[, options])
```

gulp.dest 可以理解为流的出口，会基于传入的 path 参数和流的 base 路径导出文件。

```js
// 匹配 'client/js/somedir/somefile.js'   

// base 为 client/js
// 导出 为 'build/somedir/somefile.js'
gulp.src('client/js/**/*.js')
  .pipe(minify())
  .pipe(gulp.dest('build'));  

// base 为 client
// 导出 为 'build/js/somedir/somefile.js'
gulp.src('client/js/**/*.js', { base: 'client' })
  .pipe(minify())
  .pipe(gulp.dest('build'));  // 'build/js/somedir/somefile.js'
```

### `gulp.series()`  `gulp.parallel()`
在工作流管理中，有些任务需要串行执行，有些任务可能需要并行执行

```js
gulp.task('one', function(done) {
  // do stuff
  done();
});

gulp.task('two', function(done) {
  // do stuff
  done();
});

// 并行任务，任务执行完成可以添加回调函数
gulp.task('parallelTask', gulp.parallel('one', 'two', function(done) {
  done();
}));

// 串行任务
gulp.task('seriesTask', gulp.series('one', 'two', function(done) {
  done();
}));

```

### `gulp.watch(globs[, opts][, fn])`

```js
var watcher = gulp.watch('js/**/*.js', gulp.parallel('concat', 'uglify'));
watcher.on('change', function(path, stats) {
  console.log('File ' + path + ' was changed');
});

watcher.on('unlink', function(path) {
  console.log('File ' + path + ' was removed');
});
```