import React from 'react';

import { BlogList } from '../widgets/blog-list.jsx';
import { BlogNavigation } from '../widgets/blog-navigation.jsx';

function BlogCategoryPage(props) {
  return (
    <div className="blog-category-page">
      <div className="contents">
        <BlogList {...props} type="category" key={props.route.url} />
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
