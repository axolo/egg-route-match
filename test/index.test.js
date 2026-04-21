const { test, describe } = require('node:test');
const assert = require('node:assert');
const matchRoute = require('../src/index');

const routes = [
  { methods: ['GET', 'HEAD'], path: '/user/:id' },
  { methods: ['POST'], path: '/user' },
  { methods: ['GET'], path: '/posts' },
  { methods: ['GET', 'POST'], path: '/posts/:postId/comments' },
  { methods: ['DELETE'], path: '/posts/:postId' },
  { methods: ['GET'], path: '/' }
];

describe('matchRoute', () => {
  describe('静态路由匹配', () => {
    test('应该匹配根路径', () => {
      const req = { method: 'GET', path: '/' };
      const result = matchRoute(req, routes);
      assert.deepStrictEqual(result, { method: 'GET', path: '/' });
    });

    test('应该匹配简单的静态路由', () => {
      const req = { method: 'GET', path: '/posts' };
      const result = matchRoute(req, routes);
      assert.deepStrictEqual(result, { method: 'GET', path: '/posts' });
    });

    test('不应该匹配不同方法的静态路由', () => {
      const req = { method: 'POST', path: '/posts' };
      const result = matchRoute(req, routes);
      assert.strictEqual(result, null);
    });
  });

  describe('动态路由匹配', () => {
    test('应该匹配带单个参数的路由', () => {
      const req = { method: 'GET', path: '/user/123' };
      const result = matchRoute(req, routes);
      assert.deepStrictEqual(result, { method: 'GET', path: '/user/:id' });
    });

    test('应该匹配带多个参数的路由', () => {
      const req = { method: 'GET', path: '/posts/456/comments' };
      const result = matchRoute(req, routes);
      assert.deepStrictEqual(result, { method: 'GET', path: '/posts/:postId/comments' });
    });

    test('应该匹配带字符串参数的路由', () => {
      const req = { method: 'GET', path: '/user/john-doe' };
      const result = matchRoute(req, routes);
      assert.deepStrictEqual(result, { method: 'GET', path: '/user/:id' });
    });

    test('应该匹配带UUID参数的路由', () => {
      const req = { method: 'GET', path: '/user/550e8400-e29b-41d4-a716-446655440000' };
      const result = matchRoute(req, routes);
      assert.deepStrictEqual(result, { method: 'GET', path: '/user/:id' });
    });
  });

  describe('HTTP 方法匹配', () => {
    test('应该匹配 GET 方法', () => {
      const req = { method: 'GET', path: '/user/123' };
      const result = matchRoute(req, routes);
      assert.deepStrictEqual(result, { method: 'GET', path: '/user/:id' });
    });

    test('应该匹配 HEAD 方法', () => {
      const req = { method: 'HEAD', path: '/user/123' };
      const result = matchRoute(req, routes);
      assert.deepStrictEqual(result, { method: 'HEAD', path: '/user/:id' });
    });

    test('应该匹配 POST 方法', () => {
      const req = { method: 'POST', path: '/user' };
      const result = matchRoute(req, routes);
      assert.deepStrictEqual(result, { method: 'POST', path: '/user' });
    });

    test('应该匹配 DELETE 方法', () => {
      const req = { method: 'DELETE', path: '/posts/456' };
      const result = matchRoute(req, routes);
      assert.deepStrictEqual(result, { method: 'DELETE', path: '/posts/:postId' });
    });

    test('应该处理小写的方法名', () => {
      const req = { method: 'get', path: '/user/123' };
      const result = matchRoute(req, routes);
      assert.deepStrictEqual(result, { method: 'get', path: '/user/:id' });
    });

    test('应该处理混合大小写的方法名', () => {
      const req = { method: 'Post', path: '/user' };
      const result = matchRoute(req, routes);
      assert.deepStrictEqual(result, { method: 'Post', path: '/user' });
    });
  });

  describe('不匹配的情况', () => {
    test('应该在方法不匹配时返回 null', () => {
      const req = { method: 'PUT', path: '/user/123' };
      const result = matchRoute(req, routes);
      assert.strictEqual(result, null);
    });

    test('应该在路径长度不匹配时返回 null', () => {
      const req = { method: 'GET', path: '/user/123/profile' };
      const result = matchRoute(req, routes);
      assert.strictEqual(result, null);
    });

    test('应该在静态部分不匹配时返回 null', () => {
      const req = { method: 'GET', path: '/article/123' };
      const result = matchRoute(req, routes);
      assert.strictEqual(result, null);
    });

    test('应该在空路由表时返回 null', () => {
      const req = { method: 'GET', path: '/user/123' };
      const result = matchRoute(req, []);
      assert.strictEqual(result, null);
    });

    test('应该在未提供路由表时返回 null', () => {
      const req = { method: 'GET', path: '/user/123' };
      const result = matchRoute(req);
      assert.strictEqual(result, null);
    });
  });

  describe('边界情况', () => {
    test('应该处理带尾部斜杠的路径', () => {
      const req = { method: 'GET', path: '/user/123/' };
      const result = matchRoute(req, routes);
      assert.strictEqual(result, null);
    });

    test('应该处理带前导斜杠的路径', () => {
      const req = { method: 'GET', path: '//user/123' };
      const result = matchRoute(req, routes);
      assert.strictEqual(result, null);
    });

    test('应该处理空路径', () => {
      const req = { method: 'GET', path: '' };
      const result = matchRoute(req, routes);
      assert.strictEqual(result, null);
    });

    test('应该处理只有斜杠的路径', () => {
      const req = { method: 'GET', path: '/' };
      const result = matchRoute(req, routes);
      assert.deepStrictEqual(result, { method: 'GET', path: '/' });
    });
  });

  describe('复杂路由', () => {
    const complexRoutes = [
      { methods: ['GET'], path: '/api/v1/users/:userId/posts/:postId' },
      { methods: ['GET'], path: '/api/v1/users/:userId' },
      { methods: ['POST'], path: '/api/v1/users' }
    ];

    test('应该匹配多级嵌套的动态路由', () => {
      const req = { method: 'GET', path: '/api/v1/users/123/posts/456' };
      const result = matchRoute(req, complexRoutes);
      assert.deepStrictEqual(result, { method: 'GET', path: '/api/v1/users/:userId/posts/:postId' });
    });

    test('应该匹配部分嵌套的动态路由', () => {
      const req = { method: 'GET', path: '/api/v1/users/123' };
      const result = matchRoute(req, complexRoutes);
      assert.deepStrictEqual(result, { method: 'GET', path: '/api/v1/users/:userId' });
    });
  });
});
