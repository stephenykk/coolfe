const opn = require('opn');

// open image
/*opn('./assets/comic.jpg').then(() => {
	console.log('close the viewer..');
})
*/


// open url in default browser
opn('http://www.runoob.com/python/python-tutorial.html').then(() => {
	console.log('after open the url called..')
})