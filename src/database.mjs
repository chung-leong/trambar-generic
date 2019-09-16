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
        return this.dataSource.fetchExcelFiles();
    }

    async fetchExcelFilesSearch(search) {
        const criteria = { search };
        return this.dataSource.fetchExcelFiles();
    }

    async fetchWikiPage(identifier, slug) {
        return this.dataSource.fetchWikiPage(identifier, slug);
    }

    async fetchWikiPages(identifier, criteria) {
        return this.dataSource.fetchWikiPages(identifier, criteria);
    }

    async fetchWikiPagesSearch(search) {
        const criteria = { search };
        return this.dataSource.fetchWikiPages(undefined, criteria);
    }

    async fetchWPCategory(identifier, criteria) {
        return this.dataSource.fetchWPCategory(identifier, criteria);
    }

    async fetchWPCategories(identifier, criteria) {
        return this.dataSource.fetchWPCategories(identifier, criteria);
    }

    async fetchWPCategoriesTopLevel(identifier) {
        const criteria = { parent: 0 };
        return this.dataSource.fetchWPCategories(identifier, criteria);
    }

    async fetchWPPost(identifier, criteria) {
        return this.dataSource.fetchWPPost(identifier, criteria);
    }

    async fetchWPPosts(identifier, criteria) {
        return this.dataSource.fetchWPPosts(identifier, criteria);
    }

    async fetchWPPostsCategory(identifier, category) {
        const criteria = { categories: category.id };
        return this.dataSource.fetchWPPosts(identifier, criteria);
    }

    async fetchWPPostsTag(identifier, tag) {
        const criteria = { tags: tag.id };
        return this.dataSource.fetchWPPosts(identifier, criteria);
    }

    async fetchWPPostsSearch(search) {
        //const criteria = { categories: category.id };
        //return this.dataSource.fetchWPPosts(identifier, criteria);
        return [];
    }

    async fetchWPSites() {
        return this.dataSource.fetchWPSites();
    }

    async fetchWPTag(identifier, criteria) {
        return this.dataSource.fetchWPTag(identifier, criteria);
    }

    async fetchWPTagsPopular(identifier) {
        const criteria = { orderby: 'count', order: 'desc' };
        return this.dataSource.fetchWPTags(identifier, criteria);
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

export {
    Database,
};
