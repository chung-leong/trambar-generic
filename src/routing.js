import { DataSourceProxy } from 'trambar-www';

import { InfoPage } from './pages/info-page.jsx';
import { WikiPage } from './pages/wiki-page.jsx';
import { ExcelPage } from './pages/excel-page.jsx';
import { BlogMainPage } from './pages/blog-main-page.jsx';
import { BlogCategoryPage } from './pages/blog-category-page.jsx';
import { BlogTagPage } from './pages/blog-tag-page.jsx';
import { BlogPostPage } from './pages/blog-post-page.jsx';
import { SearchPage } from './pages/search-page.jsx';
import { MissingPage } from './pages/missing-page.jsx';

const routes = {
  'home': {
    path: '/',
    component: InfoPage,
  },
  'wiki': {
    path: '/wiki/${identifier}/${slug}/',
    component: WikiPage,
  },
  'excel': {
    path: '/excel/${identifier}/',
    component: ExcelPage,
  },
  'blog': {
    path: '/blog/${identifier}/',
    component: BlogMainPage,
  },
  'blog-category': {
    path: '/blog/${identifier}/categories/${slug}/',
    component: BlogCategoryPage,
  },
  'blog-tag': {
    path: '/blog/${identifier}/tags/${slug}/',
    component: BlogTagPage,
  },
  'blog-post': {
    path: '/blog/${identifier}/${slug}/',
    component: BlogPostPage,
  },
  'search': {
    path: '/search/',
    query: {
      q: '${search}',
    },
    component: SearchPage,
  },
  'info': {
    path: '/info/',
    component: InfoPage,
  },
  'missing': {
    path: '*',
    component: MissingPage,
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

async function chooseHome(dataSource) {
  const db = new DataSourceProxy(dataSource);
  const [ page ] = await db.findWikiPages();
  if (page) {
    const { identifier, slug } = page;
    return {
      name: 'wiki',
      params: { identifier, slug }
    };
  }
  const [ site ] = await db.findWPSites();
  if (site) {
    const { identifier } = site;
    return {
      name: 'blog',
      params: { identifier }
    };
  }
}

export {
  routes,
  rewrites,
  chooseHome,
};
