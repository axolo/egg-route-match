# egg-route-match

一个轻量级的 [Egg.js] 路由匹配函数，用于在请求对象和路由表之间进行匹配。

## 特性

- 简单易用的 API
- 支持动态路由参数（如 `/user/:id`）
- 支持多种 HTTP 方法
- 轻量级，无依赖

## 安装

```bash
npm i @axolo/egg-route-match
```

## 使用

```js
const matchRoute = require('@axolo/egg-route-match');

// 请求对象
const req = { method: 'GET', path: '/user/123' };

// 路由表（来自 Egg.js 的 app.router.stack）
const routes = [
  { methods: ['GET', 'HEAD'], path: '/user/:id' },
  { methods: ['GET', 'HEAD'], path: '/user/:id/post' },
  { methods: ['PUT'], path: '/user/:id' },
  { methods: ['POST'], path: '/user' },
];

// 匹配路由
const matched = matchRoute(req, routes);

console.log(matched);
// 输出: { method: 'GET', path: '/user/:id' }
```

## API

### matchRoute(req, routes)

根据请求对象和路由表，返回匹配的路由对象。

#### 参数

|       参数        |  类型  |                          描述                           |
| ----------------- | ------ | ------------------------------------------------------- |
| req               | Object | 请求对象，如：`{ method: 'GET', path: '/user/123' }`    |
| req.method        | String | HTTP 方法，如：`'GET'`                                  |
| req.path          | String | 请求路径，如：`'/user/123'`                             |
| routes            | Array  | 路由表，来自 Egg.js 的 `app.router.stack`               |
| routes[i]         | Object | 路由对象，如：`{ methods: ['GET'], path: '/user/:id' }` |
| routes[i].methods | Array  | 支持的 HTTP 方法数组，如：`['GET', 'HEAD']`             |
| routes[i].path    | String | 路由路径，支持动态参数，如：`'/user/:id'`               |

#### 返回

未匹配到路由时，返回 `null`，否则返回匹配的路由对象。

|     返回      |  类型  |                            描述                            |
| ------------- | ------ | ---------------------------------------------------------- |
| result        | Object | 匹配的路由对象，如：`{ method: 'GET', path: '/user/:id' }` |
| result.method | String | 匹配的 HTTP 方法，如：`'GET'`                              |
| result.path   | String | 匹配的路由路径，如：`'/user/:id'`                          |

[Egg.js]: https://eggjs.org/
