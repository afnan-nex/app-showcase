/**
 * MeetSpace - Hash Router
 * Lightweight, accessible single-page view router
 */

class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.params = {};
    this.onRouteChanged = null;

    window.addEventListener('hashchange', () => this._handleHash());
  }

  register(path, handler) {
    this.routes[path] = handler;
  }

  init() {
    if (!window.location.hash || window.location.hash === '#' || window.location.hash === '#/') {
      window.location.hash = '#/dashboard';
    } else {
      this._handleHash();
    }
  }

  navigate(path) {
    window.location.hash = path.startsWith('#') ? path : `#${path}`;
  }

  _handleHash() {
    const rawHash = window.location.hash.slice(1) || '/dashboard';
    const [pathPart, queryPart] = rawHash.split('?');
    
    // Parse query params if any
    const queryParams = {};
    if (queryPart) {
      new URLSearchParams(queryPart).forEach((val, key) => {
        queryParams[key] = val;
      });
    }

    // Match exact or parameterized route (e.g., /meeting/:id)
    let matchedHandler = null;
    let params = { ...queryParams };

    for (const routePattern in this.routes) {
      const patternParts = routePattern.split('/').filter(Boolean);
      const hashParts = pathPart.split('/').filter(Boolean);

      if (patternParts.length === hashParts.length) {
        let isMatch = true;
        const extractedParams = {};

        for (let i = 0; i < patternParts.length; i++) {
          if (patternParts[i].startsWith(':')) {
            const paramName = patternParts[i].slice(1);
            extractedParams[paramName] = decodeURIComponent(hashParts[i]);
          } else if (patternParts[i] !== hashParts[i]) {
            isMatch = false;
            break;
          }
        }

        if (isMatch) {
          matchedHandler = this.routes[routePattern];
          params = { ...params, ...extractedParams };
          break;
        }
      }
    }

    if (matchedHandler) {
      this.currentRoute = pathPart;
      this.params = params;

      // Update sidebar nav active state
      this._updateActiveNav(pathPart);

      // Execute route handler
      matchedHandler(params);

      if (typeof this.onRouteChanged === 'function') {
        this.onRouteChanged(pathPart, params);
      }
    } else {
      console.warn(`Route not found: ${pathPart}, redirecting to dashboard`);
      this.navigate('/dashboard');
    }
  }

  _updateActiveNav(currentPath) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      const link = item.querySelector('a');
      if (link) {
        const href = link.getAttribute('href');
        if (href) {
          const routeTarget = href.replace('#', '');
          // If viewing /meeting/xxx, highlight /meetings
          if (currentPath === routeTarget || (currentPath.startsWith('/meeting/') && routeTarget === '/meetings')) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        }
      }
    });
  }
}

const AppRouter = new Router();
