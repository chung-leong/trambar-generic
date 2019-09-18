import React, { useState } from 'react';
import Relaks, { useProgress } from 'relaks';
import { useRichText } from 'trambar-www';

import './blog-navigation.scss';

async function BlogNavigation(props) {
    const { db, route, type } = props;
    const { identifier, slug } = route.params;
    const [ show ] = useProgress();
    const rt = useRichText();

    render();
    const categories = await fetchCategories();
    render();
    const tags = await fetchTags();
    render();

    async function fetchCategories() {
        let criteria;
        if (type === 'list') {
            criteria = { orderby: 'count', order: 'desc', parent: 0 };
        } else if (type === 'post') {
            const post = await db.fetchWPPost(identifier, slug);
            criteria = post.categories;
        }
        return db.fetchWPCategories(identifier, criteria);
    }

    async function fetchTags() {
        let criteria;
        if (type === 'list') {
            criteria = { orderby: 'count', order: 'desc' };
        } else if (type === 'post') {
            const post = await db.fetchWPPost(identifier, slug);
            criteria = post.tags;
        }
        return db.fetchWPTags(identifier, criteria);
    }

    function render() {
        show(
            <div className="blog-navigation">
                {renderCategoryBox()}
                {renderTagBox()}
            </div>
        );
    }

    function renderCategoryBox() {
        const count = (categories) ? categories.length : 0;
        if (count === 0) {
            return <div className="box hidden" />;
        } else {
            return (
                <div className="box">
                    <h4>{(count === 1) ? 'Category' : 'Categories'}</h4>
                    <ul className="categories">
                        {categories.map(renderCategory)}
                    </ul>
                </div>
            );
        }
    }

    function renderCategory(category, i) {
        const { name, slug } = category;
        const url = route.find('blog-category', { identifier, slug });
        return <li key={i}><a href={url}>{rt(name)}</a></li>;
    }

    function renderTagBox() {
        const count = (tags) ? tags.length : 0;
        if (count === 0) {
            return <div className="box hidden" />;
        } else {
            return (
                <div className="box">
                    <h4>{(count === 1) ? 'Tag' : 'Tags'}</h4>
                    <div className="tags">
                        {tags.map(renderTag)}
                    </div>
                </div>
            );
        }
    }

    function renderTag(tag, i) {
        const { name, slug } = tag;
        const url = route.find('blog-tag', { identifier, slug });
        return <span key={i}><a href={url}>{rt(name)}</a></span>;
    }
}

const component = Relaks.memo(BlogNavigation);

export {
    component as BlogNavigation,
};