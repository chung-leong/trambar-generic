import React, { useState } from 'react';
import Relaks, { useProgress } from 'relaks';
import { useRichText } from 'trambar-www';

import { LoadingAnimation } from '../widgets/loading-animation.jsx';
import { BlogCategoryBox } from '../widgets/blog-category-box.jsx';
import { BlogTagBox } from '../widgets/blog-tag-box.jsx';

import './blog-post-page.scss';

async function BlogPostPage(props) {
    const { db, route } = props;
    const { identifier, slug } = route.params;
    const [ show ] = useProgress();
    const rt = useRichText();

    render();
    const post = await db.fetchWPPost(identifier, slug);
    render();
    const author = await db.fetchWPUser(identifier, post.author);
    render();

    function render() {
        if (!post) {
            show(<LoadingAnimation />);
        } else {
            show(
                <div className="blog-post-page">
                    <div className="contents">
                        <h2>{rt(post.title)}</h2>
                        {rt(post.content)}
                    </div>
                    <div className="side-bar">
                        {renderCategoryBox()}
                        {renderTagBox()}
                    </div>
                </div>
            );
        }
    }

    function renderCategoryBox() {
        const ids = (post) ? post.categories : [];
        const props = { db, route, ids };
        return <BlogCategoryBox {...props} />;
    }

    function renderTagBox() {
        const ids = (post) ? post.tags : [];
        const props = { db, route, ids };
        return <BlogTagBox {...props} />;
    }
}

const component = Relaks.memo(BlogPostPage);

export {
    component as default,
};
