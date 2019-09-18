import React from 'react';

import { BlogList } from '../widgets/blog-list.jsx';
import { BlogNavigation } from '../widgets/blog-navigation.jsx';

import './blog-main-page.scss';

function BlogCategoryPage(props) {
    const { route } = props;
    return (
        <div className="blog-main-page">
            <div className="contents">
                <BlogList {...props} key={route.url} />
            </div>
            <div className="side-bar">
                <BlogNavigation {...props} type="list" />
            </div>
        </div>
    );
}

export {
    BlogCategoryPage as default,
};
