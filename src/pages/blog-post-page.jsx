import React, { useState } from 'react';
import Relaks, { useProgress } from 'relaks';
import { useRichText } from 'trambar-www';

import { LoadingAnimation } from '../widgets/loading-animation.jsx';
import { CategoryBox } from '../widgets/category-box.jsx';

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
    const tags = await db.fetchWPTags(identifier, post.tags);
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
        return <CategoryBox {...props} />;
    }

    function renderTagBox() {
        const ids = (post) ? post.categories : [];
        const props = { db, route, ids };
        return null;
    }
}

const component = Relaks.memo(BlogPostPage);

export {
    component as default,
};
