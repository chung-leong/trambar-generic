class Database {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }

    async fetchProjectMeta() {
        return this.dataSource.fetchProjectMeta();
    }

    async fetchExcelFile(identifier) {
        return this.dataSource.fetchExcelFile(identifier);
    }

    async fetchExcelFiles(criteria) {
        return this.dataSource.fetchExcelFiles(criteria);
    }

    async fetchWikiPage(identifier, slug) {
        return this.dataSource.fetchWikiPage(identifier, slug);
    }

    async fetchWikiPages(identifier, criteria) {
        return this.dataSource.fetchWikiPages(identifier, criteria);
    }

    async fetchWPCategory(identifier, criteria) {
        return this.dataSource.fetchWPCategory(identifier, criteria);
    }

    async fetchWPCategories(identifier, criteria) {
        return this.dataSource.fetchWPCategories(identifier, criteria);
    }

    async fetchWPPost(identifier, criteria) {
        return this.dataSource.fetchWPPost(identifier, criteria);
    }

    async fetchWPPosts(identifier, criteria) {
        return this.dataSource.fetchWPPosts(identifier, criteria);
    }

    async fetchWPSite(identifier) {
        return this.dataSource.fetchWPSite(identifier);
    }

    async fetchWPSites() {
        return this.dataSource.fetchWPSites();
    }

    async fetchWPTag(identifier, criteria) {
        return this.dataSource.fetchWPTag(identifier, criteria);
    }

    async fetchWPTags(identifier, criteria) {
        return this.dataSource.fetchWPTags(identifier, criteria);
    }

    async fetchWPUser(identifier, criteria) {
        return this.dataSource.fetchWPUser(identifier, criteria);
    }

    async fetchWPUsers(identifier, criteria) {
        return this.dataSource.fetchWPUsers(identifier, criteria);
    }
}

class Route {
    constructor(routeManager) {
        this.routeManager = routeManager;
        this.name = routeManager.name;
        this.params = routeManager.params;
        this.history = routeManager.history;
        this.url = routeManager.url;
        this.time = routeManager.time;
    }

    change(url, options) {
        return this.routeManager.change(url, options);
    }

    find(name, params) {
        return this.routeManager.find(name, params);
    }
}

class Locale {
    constructor(localeManager) {
        this.localeManager = localeManager;
        this.language = localeManager.language;
    }

    localize(data, params) {
        return this.localeManager.localize(data, params);
    }
}

export {
    Database,
    Route,
    Locale,
};
