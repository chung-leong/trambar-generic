import React, { useState } from 'react';
import Relaks, { useProgress } from 'relaks';
import { useRichText, useDateText } from 'trambar-www';

import { LoadingAnimation } from '../widgets/loading-animation.jsx';
import { BlogCategoryBox } from '../widgets/blog-category-box.jsx';
import { BlogTagBox } from '../widgets/blog-tag-box.jsx';

import './blog-category-page.scss';

async function BlogCategoryPage(props) {
    const { db, route } = props;
    const { identifier, slug } = route.params;
    const [ show ] = useProgress();
    const rt = useRichText();
    const dt = useDateText();

    render();
    const category = await db.fetchWPCategory(identifier, slug);
    render();
    const posts = await db.fetchWPPostsCategory(identifier, category);
    render();
    const categories = await db.fetchWPCategoriesTopLevel(identifier);
    render();
    const tags = await db.fetchWPTagsPopular(identifier);
    render();

    function render() {
        if (!posts) {
            show(<LoadingAnimation />);
        } else {
            show(
                <div className="blog-category-page">
                    <div className="contents">
                        {renderTitle()}
                        {posts.map(renderPost)}
                    </div>
                    <div className="side-bar">
                        {renderCategoryBox()}
                        {renderTagBox()}
                    </div>
                </div>
            );
        }
    }

    function renderTitle() {
        if (!category) {
            return;
        }
        const { name } = category;
        return <h2>Category: {rt(name)}</h2>;
    }

    function renderPost(post, i) {
        const { slug, title, excerpt, date } = post;
        const url = route.find('blog-post', { identifier, slug });
        return (
            <div key={i}>
                <h4>
                    <a href={url}>{rt(title)}</a>
                </h4>
                <div className="date">{dt(date)}</div>
                {rt(excerpt)}
            </div>
        );
    }

    function renderCategoryBox() {
        const ids = (categories) ? categories.map((c) => c.id) : [];
        const props = { db, route, ids };
        return <BlogCategoryBox {...props} />;
    }

    function renderTagBox() {
        const ids = (tags) ? tags.map((t) => t.id) : [];
        const props = { db, route, ids };
        return <BlogTagBox {...props} />;
    }
}

const component = Relaks.memo(BlogCategoryPage);

export {
    component as default,
};