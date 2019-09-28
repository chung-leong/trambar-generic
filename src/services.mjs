import { DataSource, RouteManager, LocaleManager, Excel, GitLab, Wordpress } from 'trambar-www';
import { routes, rewrites } from './routing.mjs';

async function start(options) {
    const dataSource = new DataSource([ Excel, GitLab, Wordpress ], {
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
