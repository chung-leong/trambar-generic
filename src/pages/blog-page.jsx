import React, { useState } from 'react';
import Relaks, { useProgress } from 'relaks';
import { useRichText } from 'trambar-www';

import { LoadingAnimation } from '../widgets/loading-animation.jsx';

import './blog-page.scss';

async function BlogPage(props) {
    const { db, route } = props;
    const { identifier } = route.params;
    const [ show ] = useProgress();
    const rt = useRichText();

    render();
    const posts = await db.fetchWPPosts(identifier);
    render();

    function render() {
        if (!posts) {
            show(<LoadingAnimation />);
        } else {
            show(
                <div className="blog-page">
                    {posts.map(renderPost)}
                </div>
            );
        }
    }

    function renderPost(post, i) {
        const { slug } = post;
        const url = route.find('blog-post', { identifier, slug });
        return (
            <div key={i}>
                <h4>
                    <a href={url}>{rt(post.title)}</a>
                </h4>
                {rt(post.excerpt)}
            </div>
        );
    }
}

const component = Relaks.memo(BlogPage);

export {
    component as default,
};
