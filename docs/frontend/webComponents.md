# web components notes

[Web Components 入门实例教程](http://www.ruanyifeng.com/blog/2019/08/web_components.html)

```js
class UserCard extends HTMLElement {
    constructor() {
        super()

        var image = document.createElement('image')
        image.src = 'https://semantic-ui.com/images/avatar2/large/kristy.png'
        image.classList.add('image')

        var container = document.createElement('div')
        container.classList.add('container')

        var name = document.createElement('p')
        name.classList.add('name')
        name.innerText = 'user name'

        container.append(name)
        this.append(image, container)
    }
}
```

```html
<body>
<user-card></user-card>
<template id="userCardTemplate">
    <style>
    :host {
     display: flex;
     align-items: center;
     width: 450px;
     height: 180px;
     background-color: #d4d4d4;
     border: 1px solid #d5d5d5;
     box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
     border-radius: 3px;
     overflow: hidden;
     padding: 10px;
     box-sizing: border-box;
     font-family: 'Poppins', sans-serif;
   }
   .image {
     flex: 0 0 auto;
     width: 160px;
     height: 160px;
     vertical-align: middle;
     border-radius: 5px;
   }
   </style>
   
    <img src="https://semantic-ui.com/images/avatar2/large/kristy.png" class="image">
    <div class="container">
    <p class="name">User Name</p>
    <p class="email">yourmail@some-email.com</p>
    <button class="button">Follow</button>
    </div>
</template>
<script>
class UserCard2 extends HTMLElement {
    constructor() {
        super()
        
        var templateEl = document.getElementById('userCardTemplate')
        var content = templateEl.content.cloneNode(true)
        this.append(content)
    }
}

window.customeElement.define('user-card', UserCard2)
</script>
</body>
```