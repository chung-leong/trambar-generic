import React, { useState } from 'react';
import { useProgress, useLocalized, useRichText } from 'trambar-www';

import { LoadingAnimation } from '../widgets/loading-animation.jsx';

export async function BlogContents(props) {
  const { db, route } = props;
  const { identifier, slug } = route.params;
  const [ show ] = useProgress();
  const t = useLocalized();
  const rt = useRichText({
    redirectFunc: (href, target) => {
      // see if link is to a page on the same site
      let path;
      if (href.startsWith('http:')) {
        href = 'https:' + href.substr(5);
      }
      if (!/^\w+:/.test(href)) {
        path = href;
        href = site.url + href;
      } else if (href.startsWith(site.url)) {
        path = href.substr(site.url.length);
      } else {
        return [ href, '_blank' ];
      }
      // extract post slug from path
      const m = /^\/([\w\-]+)\/?$/.exec(path);
      if (m) {
        // redirect to internal URL
        href = route.find('blog-post', { identifier, slug: m[1] });
      }
      return href;
    }
  });

  render();
  const site = await db.fetchWPSite(identifier);
  const post = await db.fetchWPPost(identifier, slug);
  render();
  const author = await db.fetchWPUser(identifier, post.author);
  render();

  function render() {
    show(
      <div className="blog-contents">
        {renderContents()}
      </div>
    );
  }

  function renderContents() {
    if (!post) {
      return <LoadingAnimation />;
    } else {
      const { date } = post;
      const authorName = rt(author?.name);
      return (
        <React.Fragment>
          <h2>{rt(post.title)}</h2>
          <div className="date">{t(date)} - {authorName}</div>
          <div className="article">
            {rt(post.content)}
          </div>
        </React.Fragment>
      );
    }
  }
}
