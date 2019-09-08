import React, { useState } from 'react';
import Relaks, { useProgress } from 'relaks';
import { useRichText } from 'trambar-www';

import { LoadingAnimation } from '../widgets/loading-animation.jsx';

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
    const categories = await db.fetchWPCategories(identifier, post.categories);
    render();
    const tags = await db.fetchWPTags(identifier, post.tags);
    render();

    function render() {
        if (!post) {
            show(<LoadingAnimation />);
        } else {
            show(
                <div className="blog-page">
                    <h2>{rt(post.title)}</h2>
                    {rt(post.content)}
                </div>
            );
        }
    }
}

const component = Relaks.memo(BlogPostPage);

export {
    component as default,
};
