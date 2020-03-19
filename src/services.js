import { DataSource, Excel, Gitlab, Wordpress } from 'trambar-www';
import { RouteManager, LocaleManager } from 'trambar-www';
import { routes, rewrites, chooseHome } from './routing.js';

async function start(options) {
  const dataSource = new DataSource([ Excel, Gitlab, Wordpress ], {
    baseURL: options.dataSourceBaseURL,
    fetchFunc: options.fetchFunc,
    refreshInterval: 5 * 60 * 1000,
  });
  dataSource.activate();

  const routeManager = new RouteManager({
    basePath: options.routeBasePath,
    routes,
    rewrites,
  });
  routeManager.activate();
  routeManager.addEventListener('beforechange', (evt) => {
    evt.postponeDefault(async () => {
      if (evt.name === 'home') {
        const home = await chooseHome(dataSource);
        if (home) {
          evt.substitute(home.name, home.params, true);
          evt.preventDefault();
        }
      }
    });
  });
  await routeManager.start(options.routePagePath);

  const localeManager = new LocaleManager({
    loadFunc: async (language) => {
      const [ lc, cc ] = language.split('-');
      try {
        const module = await import(`./locales/locale-${lc}` /* webpackChunkName: "[request]" */);
        const table = module.default;
        return table;
      } catch (err) {
        return {};
      }
    },
  });
  localeManager.activate();
  await localeManager.start(options.preferredLanguage);

  return { dataSource, routeManager, localeManager };
}

export {
  start,
};
