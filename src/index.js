/**
 * **路由匹配函数**
 *
 * @version 0.1.0
 * @description 路由匹配函数，根据请求对象和路由表，返回匹配的路由对象
 * @param {Object} req - 请求对象，如： { method: 'GET', path: '/user/123' }
 * @param {Array} routes - 路由表，Egg.js 的 app.router.stack，如： [{ methods: ['GET', 'HEAD'], path: '/user/:id' }]
 * @return {Object|null} - 匹配的路由对象，如： { method: 'GET', path: '/user/:id' }
 */
function matchRoute(req, routes = []) {
  const { method, path: reqPath } = req;

  // 边界检查：空路径、带前导斜杠、带尾部斜杠
  if (reqPath === '' // 空路径
    || reqPath.startsWith('//') // 带前导斜杠
    || (reqPath.length > 1 && reqPath.endsWith('/')) // 带尾部斜杠
  ) {
    return null;
  }

  const reqArr = reqPath.split('/').filter(Boolean); // 分段

  // 遍历路由表寻找匹配
  for (const route of routes) {
    // 匹配方法
    if (!route.methods.includes(method.toUpperCase())) {
      continue;
    }

    // 匹配分段
    const routeArr = route.path.split('/').filter(Boolean);
    if (routeArr.length !== reqArr.length) {
      continue;
    }

    // 逐段比较
    let matched = true;
    for (let i = 0; i < routeArr.length; i++) {
      const routeItem = routeArr[i];
      const reqItem = reqArr[i];

      // 如果是参数（以:开头），则匹配任何值
      if (routeItem.startsWith(':')) {
        continue;
      }

      // 否则精确匹配
      if (routeItem !== reqItem) {
        matched = false;
        break;
      }
    }

    // 如果找到匹配
    if (matched) {
      return {
        method,
        path: route.path,
      };
    }
  }

  // 没有找到匹配
  return null;
}

module.exports = matchRoute;
