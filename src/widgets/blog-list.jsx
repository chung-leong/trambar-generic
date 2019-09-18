import React, { useState } from 'react';
import Relaks, { useProgress } from 'relaks';
import { useRichText, useDateText } from 'trambar-www';

import { LoadingAnimation } from '../widgets/loading-animation.jsx';

import './blog-list.scss';

async function BlogList(props) {
    const { db, route, type } = props;
    const { identifier, slug } = route.params;
    const [ show ] = useProgress();
    const rt = useRichText();
    const dt = useDateText();

    render();
    const category = await fetchCategory();
    const tag = await fetchTag();
    const posts = await fetchPosts();
    render();

    async function fetchCategory() {
        if (type === 'category') {
            return db.fetchWPCategory(identifier, slug);
        }
    }

    async function fetchTag() {
        if (type === 'tag') {
            return db.fetchWPTag(identifier, slug);
        }
    }

    async function fetchPosts() {
        let criteria;
        if (type === 'category') {
            criteria = { categories: category.id };
        } else if (type === 'tag') {
            criteria = { tags: tag.id };
        }
        return db.fetchWPPosts(identifier, criteria);
    }

    function render() {
        show(
            <div className="blog-list">
                {renderHeading()}
                {renderContents()}
            </div>
        , 'initial');
    }

    function renderHeading() {
        if (!posts) {
            return <LoadingAnimation />;
        } else {
            if (category) {
                return <h1>Category: {rt(category.name)}</h1>;
            } else if (tag) {
                return <h1>Tag: {rt(tag.name)}</h1>;
            }
        }
    }

    function renderContents() {
        if (posts) {
            return posts.map(renderPost);
        }
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
}

const component = Relaks.memo(BlogList);

export {
    component as BlogList,
};
