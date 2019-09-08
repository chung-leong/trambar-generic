import { RouteManager, DataSource, Excel, GitLab, Wordpress } from 'trambar-www';
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

    return { dataSource, routeManager };
}

export {
    start,
};
