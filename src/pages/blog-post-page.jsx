import React, { useState } from 'react';
import { useProgress, useRichText } from 'trambar-www';

import { BlogContents } from '../widgets/blog-contents.jsx';
import { BlogNavigation } from '../widgets/blog-navigation.jsx';

export function BlogPostPage(props) {
  return (
    <div className="blog-category-page">
      <div className="contents">
        <BlogContents {...props} key={props.route.url} />
      </div>
      <div className="side-bar">
        <BlogNavigation {...props} type="post" />
      </div>
    </div>
  );
}
