import React from 'react';

import { BlogList } from '../widgets/blog-list.jsx';
import { BlogNavigation } from '../widgets/blog-navigation.jsx';

export function BlogMainPage(props) {
  return (
    <div className="blog-main-page">
      <div className="contents">
        <BlogList {...props} key={props.route.url} />
      </div>
      <div className="side-bar">
        <BlogNavigation {...props} type="list" />
      </div>
    </div>
  );
}
