import React, { useState, useEffect } from 'react';
import { useProgress, useListener, useLocalized, useRichText } from 'trambar-www';

import { LoadingAnimation } from '../widgets/loading-animation.jsx';

export async function BlogList(props) {
  const { db, route, type } = props;
  const { identifier, slug } = route.params;
  const [ show ] = useProgress();
  const t = useLocalized();
  const rt = useRichText();
  const minimum = 20;
  const maximum = 1000;

  const handleScroll = useListener((evt) => {
    const { scrollTop, scrollHeight, clientHeight } = document.body.parentNode;
    if (scrollTop + clientHeight > scrollHeight * 0.5) {
      if (posts && posts.length < maximum) {
        posts.more();
      }
    }
  });

  useEffect(() => {
    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  render();
  const category = await fetchCategory();
  const tag = await fetchTag();
  const posts = await fetchPosts();
  render();

  if (posts.length < minimum) {
    posts.more();
  }

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
    return db.findWPPosts(identifier, criteria);
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
        return <h1>{t('Category')}: {rt(category.name)}</h1>;
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
        <div className="date">{t(date)}</div>
        <div className="excerpt">
          {rt(excerpt)}
        </div>
      </div>
    );
  }
}
