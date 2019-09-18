import React from 'react';

import { BlogList } from '../widgets/blog-list.jsx';
import { BlogNavigation } from '../widgets/blog-navigation.jsx';

import './blog-category-page.scss';

function BlogCategoryPage(props) {
    const { route } = props;
    return (
        <div className="blog-category-page">
            <div className="contents">
                <BlogList {...props} type="category" key={route.url} />
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
