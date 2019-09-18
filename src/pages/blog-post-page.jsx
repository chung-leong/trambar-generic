import React, { useState } from 'react';
import Relaks, { useProgress } from 'relaks';
import { useRichText } from 'trambar-www';

import { BlogContents } from '../widgets/blog-contents.jsx';
import { BlogNavigation } from '../widgets/blog-navigation.jsx';

import './blog-post-page.scss';

function BlogPostPage(props) {
    const { route } = props;
    return (
        <div className="blog-category-page">
            <div className="contents">
                <BlogContents {...props} key={route.url} />
            </div>
            <div className="side-bar">
                <BlogNavigation {...props} type="post" />
            </div>
        </div>
    );
}

export {
    BlogPostPage as default,
};
