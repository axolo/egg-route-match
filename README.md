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

```javascript
const matchRoute = require('@axolo/egg-route-match');

// 请求对象
const req = {
  method: 'GET',
  path: '/user/123'
};

// 路由表（来自 Egg.js 的 app.router.stack）
const routes = [
  { methods: ['GET', 'HEAD'], path: '/user/:id' },
  { methods: ['POST'], path: '/user' },
  { methods: ['GET'], path: '/posts' }
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

- `req` (Object): 请求对象
  - `method` (String): HTTP 方法，如 `'GET'`, `'POST'` 等
  - `path` (String): 请求路径，如 `'/user/123'`
- `routes` (Array): 路由表，来自 Egg.js 的 `app.router.stack`
  - 每个路由对象包含:
    - `methods` (Array): 支持的 HTTP 方法数组
    - `path` (String): 路由路径，支持动态参数

#### 返回

- `Object|null`: 匹配的路由对象，包含 `method` 和 `path` 属性；如果没有匹配则返回 `null`

#### 示例

```javascript
// 静态路由匹配
matchRoute(
  { method: 'GET', path: '/posts' },
  [{ methods: ['GET'], path: '/posts' }]
);
// 返回: { method: 'GET', path: '/posts' }

// 动态路由匹配
matchRoute(
  { method: 'GET', path: '/user/123' },
  [{ methods: ['GET'], path: '/user/:id' }]
);
// 返回: { method: 'GET', path: '/user/:id' }

// 多方法匹配
matchRoute(
  { method: 'HEAD', path: '/user/123' },
  [{ methods: ['GET', 'HEAD'], path: '/user/:id' }]
);
// 返回: { method: 'HEAD', path: '/user/:id' }

// 不匹配的情况
matchRoute(
  { method: 'POST', path: '/user/123' },
  [{ methods: ['GET'], path: '/user/:id' }]
);
// 返回: null
```

## 测试

```bash
npm test
```

## License

MIT

[Egg.js]: https://eggjs.org/
