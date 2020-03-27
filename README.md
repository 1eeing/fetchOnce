# fetchOnce
首屏请求前端解决方案


## 安装
```bash
npm install fetchOnce --save
```


## 如何使用
```js
import fetchOnce from 'fetchOnce'

const getUserInfo = () => {
  return fetch('test.com');
};

const getUserInfoFetchOnce = fetchOnce(getUserInfo);

getUserInfoFetchOnce().then(res => {
  console.log(res);
})
```


## 参数说明
### fn
请求函数，返回一个promise

### options?
可选配置

#### options.type
存储类型，`local | session | memory` 三个值可选，默认存储到内存中。表示存储到哪

#### options.key
当需要存储到storage中时，需要传入一个自定义key
