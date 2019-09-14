import React, { useState } from 'react';
import Relaks, { useProgress } from 'relaks';
import { useRichText, useDateText } from 'trambar-www';

import { LoadingAnimation } from '../widgets/loading-animation.jsx';
import { BlogTagBox } from '../widgets/blog-tag-box.jsx';

import './blog-tag-page.scss';

async function BlogTagPage(props) {
    const { db, route } = props;
    const { identifier, slug } = route.params;
    const [ show ] = useProgress();
    const rt = useRichText();
    const dt = useDateText();

    render();
    const tag = await db.fetchWPTag(identifier, slug);
    render();
    const criteria = { tags: tag.id };
    const posts = await db.fetchWPPosts(identifier, criteria);
    render();

    function render() {
        if (!posts) {
            show(<LoadingAnimation />);
        } else {
            show(
                <div className="blog-tag-page">
                    <div className="contents">
                        {renderTitle()}
                        {posts.map(renderPost)}
                    </div>
                    <div className="side-bar">
                        {renderTagBox()}
                    </div>
                </div>
            );
        }
    }

    function renderTitle() {
        if (!tag) {
            return;
        }
        const { name } = tag;
        return <h2>Tag: {rt(name)}</h2>;
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

    function renderTagBox() {
        const ids = [];
        const props = { db, route, ids };
        return <BlogTagBox {...props} />;
    }
}

const component = Relaks.memo(BlogTagPage);

export {
    component as default,
};
