class Route {
    constructor(routeManager) {
        this.routeManager = routeManager;
        this.name = routeManager.name;
        this.params = routeManager.params;
        this.history = routeManager.history;
        this.url = routeManager.url;
    }

    change(url, options) {
        return this.routeManager.change(url, options);
    }

    find(name, params) {
        return this.routeManager.find(name, params);
    }
}

const routes = {
    'home': {
        path: '/',
        load: (match) => {
            match.params.module = require('pages/home-page.jsx');
        }
    },
    'wiki': {
        path: '/wiki/${identifier}/${slug}/',
        load: (match) => {
            match.params.module = require('pages/wiki-page.jsx');
        }
    },
    'excel': {
        path: '/excel/${identifier}/',
        load: (match) => {
            match.params.module = require('pages/excel-page.jsx');
        }
    },
    'blog': {
        path: '/blog/${identifier}/',
        load: (match) => {
            match.params.module = require('pages/blog-page.jsx');
        }
    },
    'blog-category': {
        path: '/blog/${identifier}/categories/${slug}/',
        load: (match) => {
            match.params.module = require('pages/blog-category-page.jsx');
        }
    },
    'blog-tag': {
        path: '/blog/${identifier}/tags/${slug}/',
        load: (match) => {
            match.params.module = require('pages/blog-tag-page.jsx');
        }
    },
    'blog-post': {
        path: '/blog/${identifier}/${slug}/',
        load: (match) => {
            match.params.module = require('pages/blog-post-page.jsx');
        }
    },
    'search': {
        path: '/search/',
        query: {
            q: '${search}',
        },
        load: (match) => {
            match.params.module = require('pages/search-page.jsx');
        }
    },

};

class CommitRewriter {
    static from(urlParts, context) {
        let regExp = /^\/\((.+?)\)/;
        let match = regExp.exec(urlParts.path);
        if (match) {
            // e.g. https://example.net/(development)/blog/
            context.commit = match[1];
            urlParts.path = urlParts.path.substr(match[0].length) || '/';
        }
    }

    static to(urlParts, context) {
        if (context.commit) {
            urlParts.path = `/(${context.commit})` + urlParts.path;
        }
    }
}

const rewrites = [
    CommitRewriter,
];

export {
    Route,
    routes,
    rewrites,
};
