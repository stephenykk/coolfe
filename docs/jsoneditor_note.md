JSONEditor
================

快速预览
--------------

### 设置options

    JSONEditor.defaults.options.theme = 'bootstrap3';
    JSONEditor.defaults.options.iconlib = 'bootstrap3';

### 初始化editor

    // 初始化editor
    var editorDiv = document.getElementById('editorHolder')
    var editor = new JSONEditor(editorDiv, {
        schema: {
            type: "object",// type决定采用的editor类型 和 返回的值类型
            properties: {
                name: { type: 'string'}
            }
        },
        startval: startval //初始值
    });

### 读取/设置/验证editor的值

    // set the value
    editor.setValue({
        name: 'John Smith'
    });

    // get the value
    var data = editor.getValue(); // {name: 'John Smith'}

    // validate
    var errors = editor.validate();
    if (errors.length) { // not valid }

    // listen for changes
    editor.on('change', function() {
        // do sth..
    });

### 示例1 

    // schema example
    schema = {
                title: "Person",
                type: "object", // editor返回值的类型
                properties: { // properties定义object的字段
                    name: {
                        type: "string",
                        description: "First and Last name", // 位于控件右边或下面的输入提示
                        minLength: 4, // 验证条件 值长度
                        default: "Jeremy Dorn" // 默认值
                    },
                    age: {
                        type: "integer",
                        default: 25,
                        minimum: 18, // 验证条件 值范围
                        maximum: 99
                    },
                    favorite_color: {
                        type: "string",
                        format: "color",
                        title: "favorite color", // title作为控件的label, 若无title则用字段名作为label
                        default: "#ffa500"
                    },
                    gender: {
                        type: "string",
                        enum: ["male", "female"] // 带enum字段 为下拉列表
                    },
                    location: {
                        type: "object",
                        title: "Location",
                        properties: {
                            city: {
                                type: "string",
                                default: "San Francisco"
                            },
                            state: {
                                type: "string",
                                default: "CA"
                            },
                            citystate: {
                                type: "string",
                                description: "This is generated automatically from the previous two fields",
                                template: "{{city}}, {{state}}", //值的模板，从其他字段值组成 city state为watch的字段
                                watch: {
                                    city: 'location.city',  // 定义city字段与谁同步
                                    state: 'location.state'
                                }
                            }
                        }
                    },
                    pets: {
                        type: "array",
                        format: "table", // 控件的形式，值为array时，控件可以是table 和 tabs
                        title: "Pets",
                        uniqueItems: true,
                        items: {// array用items定义 数组的元素
                            type: "object",
                            title: "Pet", // 被用于添加按钮 删除按钮的文本
                            properties: {
                                type: {
                                    type: "string",
                                    enum: ["cat","dog","bird","reptile","other"],
                                    default: "dog"
                                },
                                name: {
                                    type: "string"
                                }
                            }
                        },
                        default: [ // 数组的默认值
                            {
                                type: "dog",
                                name: "Walter"
                            }
                        ]
                    }
                }
            }
        }



### 示例2

    // 普通的json对象
    var starting_value = [
        {
          name: "John Smith",
          age: 35,
          gender: "male",
          location: {
            city: "San Francisco",
            state: "California",
            citystate: ""
          },
          pets: [
            {
              name: "Spot",
              type: "dog",
              fixed: true
            },
            {
              name: "Whiskers",
              type: "cat",
              fixed: false
            }
          ]
        }
      ];
    
    var editor = new JSONEditor(editorDiv, {
            // Enable fetching schemas via ajax
            ajax: true,
            
            // The schema for the editor
            schema: {
              type: "array",
              title: "People",
              format: "tabs",
              items: {
                title: "Person",
                headerTemplate: "{{i}} - {{self.name}}", // 选项卡的内容模板 self引用数组元素自身
                oneOf: [
                  {
                    $ref: "basic_person.json", // ajax请求的url 返回schema定义
                    title: "Basic Person"
                  },
                  {
                    $ref: "person.json",
                    title: "Complex Person"
                  }
                ]
              }
            },
            
            // 设置表单控件初始值
            startval: starting_value,
            
            // 禁用添加额外属性
            no_additional_properties: true,
            
            // 默认所有属性必须
            required_by_default: true
          });
          
          submitBtn.addEventListener('click',function() {
            console.log(editor.getValue()); // 获取editor的值
          });
          
          restoreBtn.addEventListener('click',function() {
            editor.setValue(starting_value);// 设置表单为初始值
          });
          
          toggleEnableBtn.addEventListener('click',function() {
            if(!editor.isEnabled()) {// 表单禁用启用 editor.isEnabled()
              editor.enable();
            }
            else {
              editor.disable();
            }
          });
          // 修改表单值 则验证，提示验证结果
          editor.on('change',function() {
            var errors = editor.validate();
            var indicator = document.getElementById('valid_indicator');
            if(errors.length) {
              indicator.style.color = 'red';
              indicator.textContent = "not valid";
            } else {
              indicator.style.color = 'green';
              indicator.textContent = "valid";
            }
          });

基本用法
---------------------
### 初始化编辑器

    var editorDiv = document.getElementById('editorHolder');
    var editor = new JSONEditor(edirtorDiv, options); // { schema: {}, startval: {} }

### options设置

    // 全局设置options
    JSONEditor.defaults.options.theme = 'bootstrap3';

    // 设置editor实例的options
    var editor = new JSONEditor(editorDiv, { schema: { }, theme: 'bootstrap3'});

### options字段列表:

option | desc | default
-------|------|---------
ajax | 通过$ref字段指定的url获取数据 | false
disable_array_add | 禁用"add row" 按钮 | false
disable_array_reorder | 禁用 "move up", "move down" 按钮 | false
disable_collapse | 禁用 "collapse" 按钮 | false
didsable_editor_json | 禁用 "edit json" 按钮 | false
disable_properties | 禁用 "properties" 按钮 | false
form_name_root | input[name]属性的前缀 | root
iconlib | 图标库 | null
no_additional_properties | properties弹窗禁用添加字段功能 | false
refs | 值为{} 包含可以获取schema定义的url | {}
required_by_default | 默认所有属性都必须，要隐藏需显示指定 required: false | false
keep_oneof_values | 当切换有oneof指定的schema时，旧值也跟随切换 | true
schema | editor的schema, 定义各种属性和字段 | {}
show_errors | 何时显示验证错误 `interaction` , `change`, `always`, `never` | `interaction`
startval | editor的初始值 | null
template | 用哪种JS模板引擎 | default
theme | 使用哪种Css框架 | html 
display_required_only | 仅显示 `required: true` 的字段 | false

**若设置 options.ajax = true, 则 editor的api将在数据获取后才可用**

    editor.on('ready', function(){
        // now api methods can available
        editor.validate();
    });


### 读取/设置 editor的值

    editor.setValue({name: 'John Smith'});
    editor.getValue(); // {name: 'John Smith'}

    // 获取editor的某个节点
    var name = editor.getEditor('root.name');
    if(name) {// root.name 节点存在
        name.setValue('sindy');
        name.getValue(); // sindy
    }

### 验证

    var errors = editor.validate();
    if(errors.length) {
        //invalid
    }else{
        //valid
    }

    // 验证指定的值相对于editor的控件是否合法
    var errors = editor.validate({
            name: 'a long name not valid'
        });


### 监听editor的变化

    editor.on('change', function() {
        do sth..
    });

    editor.off('change', callback);

    //监听editor某节点的变化
    editor.watch('root.person.name', function(){
        // do sth..
    });
    editor.unwatch('root.person.name', function() {
        // do sth..
    });


### 禁用/启用editor

    editor.isEnabled();
    editor.enable(); //启用
    editor.disable(); //禁用
    
    //禁用editor的某节点
    editor.getEditor('root.location').disable();
    //启用editor的某节点
    editor.getEditor('root.location').enable();

### 销毁editor

    editor.destroy(); // 删除editor相关dom, 释放相关资源

JSON Schema
----------------

### $ref and definitions
schema可以本地定义，或通过url获取

    {
        type: 'object',
        properties: {
            name: {
                title: 'Full Name',
                $ref: '#/definitions/name'
            },
            location: {
                $ref: 'http://mydomain.com/geo.json'
            }
        },
        definitions: { // definitions 字段名固定, 不能随意指定
            name: {
                type: 'string',
                minLength: 5
            }
        }
    }

### hyper-schema links

    // 简单的文本链接
    {
        title: 'blog post id',
        type: 'integer',
        links: [
            {
                rel: 'comments',
                href: '/posts/{{self}}/comments',
                class: 'comment-link'
            }
        ]
    }

    // 点击下载的链接
    {
        title: 'document filename',
        type: 'string',
        links: [
            {
                rel: 'download file',
                href: '/documents/{{self}}',
                download: true
            }
        ]
    }

    {
      "title": "Video filename",
      "type": "string",
      "links": [
        {
          "href": "/videos/{{self}}.mp4",
          "mediaType": "video/mp4"
        }
      ]
    }

### propertyOrder 字段顺序

    {
      "type": "object",
      "properties": {
        "prop1": {
          "type": "string"
        },
        "prop2": {
          "type": "string",
          "propertyOrder": 10 // 字段顺序 默认1000
        },
        "prop3": {
          "type": "string",
          "propertyOrder": 1001
        },
        "prop4": {
          "type": "string",
          "propertyOrder": 1
        }
      }
    }

### defaultProperties 默认显示的字段

    {
      "type": "object",
      "properties": {
        "name": {"type": "string"},
        "age": {"type": "integer"}
      },
      "defaultProperties": ["name"]
    }

### format
当字段为`type: 'string'`, 支持多种format; 当指定了`enum`时，format设置无效.

`format`取值范围：
+ text
+ textarea
+ email
+ url
+ tel
+ number
+ range
+ date
+ time
+ datetime
+ month
+ week

显示颜色选择器

    {
        type: 'object',
        properties: {
            color: {
                type: 'string',
                format: 'color' // 颜色选择器
            }
        }
    }

### Boolean

    {
        type: 'boolean',
        format: 'checkbox' //默认 select
    }

### Array

    {
        type: 'array',
        format: 'table' // table or tabs
        items: {
            type: 'object',
            properties: {
                name: { type: 'string' }
            }
        }
    }

    {
      "type": "array",
      "uniqueItems": true, // item唯一
      "items": {
        "type": "string",
        "enum": ["value1","value2"] // checkbox  or select 默认元素个数小于8用checkbox, 否则用select
      }
    }

### Object

    {
      "type": "object",
      "properties": {
        "name": { "type": "string" }
      },
      "format": "grid" // 表格形式 更节省空间，但字段顺序无法保证
    }


**child editor的options**
+ collapsed
+ disable_array_add
+ disable_array_delete
+ disable_array_delete_all_rows
+ disable_array_delete_last_rows
+ disable_array_reorder
+ disable_edit_json
+ disable_properties
+ enum_title
+ expand_height
+ grid_columns
+ hidden
+ input_height
+ input_width
+ remove_empty_properties  // editor.getValue()时 不返回空值的字段


    {
      "type": "object",
      "options": {
        "collapsed": true // 初始折叠起来
      },
      "properties": {
        "name": {
          "type": "string"
        }
      }
    }
    
    //JSONEditor.defaults: {options: {..}, editors: {...}}
    //JSONEditor.plugins
    // 全局设置options
    JSONEditor.defaults.editors.object.options.collapsed = true;


### 字段值之间的依赖关系

    {
      "type": "object",
      "properties": {
        "first_name": {
          "type": "string"
        },
        "last_name": {
          "type": "string"
        },
        "full_name": {
          "type": "string",
          "watch": {
            "fname": "first_name", // 监听first_name字段的变化 新值赋给fname  (first_name 是相对于 root 的路径)
            "lname": "last_name"
          }
        }
      }
    }


    {
      "type": "array",
      "items": {
        "type": "object",
        "id": "arr_item",//定义id
        "properties": {
          "first_name": {
            "type": "string"
          },
          "last_name": {
            "type": "string"
          },
          "full_name": {
            "type": "string",
            "template": "{{fname lname}}", // 值的模板 用JS模板引擎解析 支持多种模板引擎 (mustache,underscore,handlebars,ejs)
            "watch": {
              "fname": "arr_item.first_name", // path相对于特定id
              "lname": "arr_item.last_name"
            }
          }
        }
      }
    }

**JS模板引擎**  
支持多种模板引擎 (mustache,underscore,handlebars,ejs)

    JSONEditor.defaults.options.template = 'handlebars'; //全局设置模板引擎

    var editor = new JSONEditor(element,{//实例化时设置模板引擎
      schema: schema,
      template: 'hogan'
    });

**可枚举值**  

    {
      "type": "object",
      "properties": {
        "possible_colors": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "primary_color": {// primary_color需在 possible_colors 中存在
          "type": "string"
          "watch": {
            "colors": "possible_colors" //监听 possible_colors
          },
          "enumSource": "colors" //枚举数据源为colors
        }
      }
    }


    {
      "type": "object",
      "properties": {
        "possible_colors": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "text": {
                "type": "string"
              }
            }
          }
        },
        "primary_color": {
          "type": "string",
          "watch": {
            "colors": "possible_colors"
          },
          "enumSource": [{
            "source": "colors",
            "value": "{{item.text}}"
          }]
        }
      }
    }


### 动态头部

    {
      "type": "array",
      "title": "Children",
      "items": {
        "type": "object",
        "title": "Child",
        "headerTemplate": "{{ i1 }} - {{ self.name }} (age {{ self.age }})", // headerTemplate 指定动态的头部
        "properties": {
          "name": { "type": "string" },
          "age": { "type": "integer" }
        }
      }
    }

### 自定义模板引擎

    var myengine = {
      compile: function(template) {
        // Compile should return a render function
        return function(vars) {
          // A real template engine would render the template here
          var result = template;
          return result;
        }
      }
    };

    // Set globally
    JSONEditor.defaults.options.template = myengine;

    // Set on a per-instance basis
    var editor = new JSONEditor(element,{
      schema: schema,
      template: myengine
    });

### 语言和字符串自定义

    // 重写提示信息
    JSONEditor.defaults.languages.en.error_minLength =
      "This better be at least {{0}} characters long or else!";


    // 创建自己的语言包, 缺少的key会采用en的
    JSONEditor.defaults.languages.es = {
      error_notset: "propiedad debe existir"
    };

    JSONEditor.defaults.language = "es";


### 自定义editor的ui
默认地, editor的每种format都对应原生的form控件; JSONEditor用 resolver functions 决定不同类型的schema/subschema用哪种ui

    // Add a resolver function to the beginning of the resolver list
    // This will make it run before any other ones
    JSONEditor.defaults.resolvers.unshift(function(schema) {
      if(schema.type === "object" && schema.format === "location") {
        return "location";
      }

      // If no valid editor is returned, the next resolver function will be used
    });

    // 下面这个schema的元素将用自定义的editor(location)代替默认的object
    {
      "type": "array",
      "items": {
        "type": "object",
        "format": "location",
        "properties": {
          "longitude": {
            "type": "number"
          },
          "latitude": {
            "type": "number"
          }
        }
      }
    }


### 自定义过滤器

    // Custom validators must return an array of errors or an empty array if valid
    JSONEditor.defaults.custom_validators.push(function(schema, value, path) {
      var errors = [];
      if(schema.format==="date") {
        if(!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(value)) {
          // Errors must be an object with `path`, `property`, and `message`
          errors.push({
            path: path,
            property: 'format',
            message: 'Dates must be in the format "YYYY-MM-DD"'
          });
        }
      }
      return errors;
    });
