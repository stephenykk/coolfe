const opn = require('opn');

// open image
/*opn('./assets/comic.jpg').then(() => {
	console.log('close the viewer..');
})
*/

// open url in default browser
opn('https://baidu.com').then(() => {
	console.log('after close bs?')
})