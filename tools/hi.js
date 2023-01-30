const prompt = require('prompt')

prompt.start()
prompt.message = '提示'

// prompt.get(['user', 'age'], (err, result) => {
//     console.log('result:', result);
// })

prompt.get({
    properties: {
        user: {
            description: '请输入你的名字',
            type: 'string'
        },
        age: {
            description: '你的年龄是?',
            type: 'number'
        },
        like: {
            description: '喜欢动画吗?',
            type: 'boolean'
        }
    }
}, (err, result) => {
    console.log('result::', result)
})