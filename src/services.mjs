import { DataSource, RouteManager, LocaleManager, Excel, GitLab, Wordpress } from 'trambar-www';
import { routes, rewrites } from './routing.mjs';

async function start(options) {
    const dataSource = new DataSource([ Excel, GitLab, Wordpress ], {
        baseURL: options.dataSourceBaseURL,
        fetchFunc: options.fetchFunc,
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
            const file = await dataSource.fetchExcelFile('ui-text');
            const table = file.localization(language);
            return table;
        },
    });
    localeManager.activate();
    await localeManager.start(options.preferredLanguage);

    return { dataSource, routeManager, localeManager };
}


export {
    start,
};
