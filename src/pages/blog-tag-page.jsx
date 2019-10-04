import React from 'react';

import { BlogList } from '../widgets/blog-list.jsx';
import { BlogNavigation } from '../widgets/blog-navigation.jsx';

function BlogTagPage(props) {
    return (
        <div className="blog-category-page">
            <div className="contents">
                <BlogList {...props} type="tag" key={props.route.url} />
            </div>
            <div className="side-bar">
                <BlogNavigation {...props} type="list" />
            </div>
        </div>
    );
}

export {
    BlogTagPage as default,
};
