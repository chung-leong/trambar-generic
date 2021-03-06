import React, { useState } from 'react';
import { useProgress, useRichText, useLocalized } from 'trambar-www';

export async function BlogNavigation(props) {
  const { db, route, type } = props;
  const { identifier, slug } = route.params;
  const [ show ] = useProgress();
  const rt = useRichText();
  const t = useLocalized();

  render();
  const categories = await fetchCategories();
  render();
  const tags = await fetchTags();
  render();

  preloadPosts();

  async function fetchCategories() {
    let criteria;
    if (type === 'list') {
      criteria = { orderby: 'count', order: 'desc', parent: 0 };
    } else if (type === 'post') {
      const post = await db.fetchWPPost(identifier, slug);
      criteria = post.categories;
    }
    return db.findWPCategories(identifier, criteria);
  }

  async function fetchTags() {
    let criteria;
    if (type === 'list') {
      criteria = { orderby: 'count', order: 'desc' };
    } else if (type === 'post') {
      const post = await db.fetchWPPost(identifier, slug);
      criteria = post.tags;
    }
    return db.findWPTags(identifier, criteria);
  }

  async function preloadPosts() {
    for (let category of categories) {
      await db.findWPPosts(identifier, { categories: category.id });
    }
    for (let tag of tags) {
      await db.findWPPosts(identifier, { tags: tag.id });
    }
  }

  function render() {
    show(
      <div className="blog-navigation">
        {renderCategoryBox()}
        {renderTagBox()}
      </div>
    );
  }

  function renderCategoryBox() {
    const count = categories?.length || 0;
    if (count === 0) {
      return <div className="box hidden" />;
    } else {
      const heading = t(count === 1 ? 'Category' : 'Categories');
      return (
        <div className="box">
          <h4>{heading}</h4>
          <ul className="categories">
            {categories.map(renderCategory)}
          </ul>
        </div>
      );
    }
  }

  function renderCategory(category, i) {
    const { name, slug } = category;
    const url = route.find('blog-category', { identifier, slug });
    return <li key={i}><a href={url}>{rt(name)}</a></li>;
  }

  function renderTagBox() {
    const count = tags?.length || 0;
    if (count === 0) {
      return <div className="box hidden" />;
    } else {
      const headings = t(count === 1 ? 'Tag' : 'Tags');
      return (
        <div className="box">
          <h4>{headings}</h4>
          <div className="tags">
            {tags.map(renderTag)}
          </div>
        </div>
      );
    }
  }

  function renderTag(tag, i) {
    const { name, slug } = tag;
    const url = route.find('blog-tag', { identifier, slug });
    return <span key={i}><a href={url}>{rt(name)}</a></span>;
  }
}
