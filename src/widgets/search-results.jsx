import React, { useState, useEffect } from 'react';
import { useProgress, useListener, useLocalized, useRichText } from 'trambar-www';

import { LoadingAnimation } from '../widgets/loading-animation.jsx';

export async function SearchResults(props) {
  const { db, route } = props;
  const { identifier, search } = route.params;
  const [ show ] = useProgress();
  const t = useLocalized();
  const rt = useRichText();
  const minimum = 20;
  const maximum = 1000;

  const handleScroll = useListener((evt) => {
    const { scrollTop, scrollHeight, clientHeight } = document.body.parentNode;
    if (scrollTop + clientHeight > scrollHeight * 0.5) {
      if (blogResults && blogResults.length < maximum) {
        blogResults.more();
      }
    }
  });

  useEffect(() => {
    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  let resultCount = 0;
  let searchComplete = false;
  render();
  const wikis = await searchWiki();
  resultCount += wikis.length;
  render();
  const files = await searchExcelFiles();
  resultCount += files.length;
  render();
  const blogResults = await searchBlogs();
  resultCount += blogResults.total;
  searchComplete = true;
  render();

  if (blogResults.length < minimum) {
    blogResults.more();
  }

  async function searchWiki() {
    if (!search) {
      return [];
    }
    return db.findWikiPages(undefined, { search });
  }

  async function searchExcelFiles() {
    if (!search) {
      return [];
    }
    return db.fetchExcelFiles({ search });
  }

  async function searchBlogs() {
    if (!search) {
      const empty = [];
      empty.more = () => {};
      return empty;
    }
    const resultSets = {};
    const sites = await db.fetchWPSites();
    for (let site of sites) {
      const { identifier } = site;
      const posts = await db.fetchWPPosts(identifier, { search });
      resultSets[identifier] = posts;
    }

    // interleave the results from different blogs
    const list = [];
    for (let si = 0, more = true; more; si += 10) {
      more = false;
      for (let site of sites) {
        const { identifier } = site;
        const posts = resultSets[identifier];
        let ei = si + 10;
        if (ei < posts.length) {
          more = true;
        } else {
          ei = posts.length;
        }
        for (let i = si; i < ei; i++) {
          list.push({ identifier, post: posts[i] });
        }
      }
    }

    // add up the total
    list.total = 0;
    list.pages = 0;
    for (let site of sites) {
      const { identifier } = site;
      const posts = resultSets[identifier];
      if (posts.total) {
        list.total += posts.total;
      }
      if (posts.pages) {
        list.pages += posts.pages;
      }
    }

    // fetch more from each blog
    list.more = () => {
      for (let site of sites) {
        const { identifier } = site;
        const posts = resultSets[identifier];
        posts.more();
      }
    };
    return list;
  }

  function render() {
    show(
      <div className="search-results">
        {renderContents()}
      </div>
    );
  }

  function renderContents() {
    if (resultCount === 0 && !searchComplete) {
      return <LoadingAnimation />;
    } else {
      return (
        <React.Fragment>
          {renderTitle()}
          {renderWikis()}
          {renderExcelFiles()}
          {renderBlogResults()}
        </React.Fragment>
      );
    }
  }

  function renderTitle() {
    let heading;
    if (resultCount > 0) {
      const count = (resultCount < maximum) ? resultCount : `${maximum}+`;
      heading = `${t('Search results')} (${count})`;
    } else {
      heading = t('No results');
    }
    return <h2>{heading}</h2>;
  }

  function renderWikis() {
    if (!wikis) {
      return;
    }
    return wikis.map(renderWiki);
  }

  function renderWiki(wiki, i) {
    const { identifier, slug, title } = wiki;
    const url = route.find('wiki', { identifier, slug });
    return (
      <div key={i}>
        <h4>
          <a href={url}>{title}</a>
        </h4>
      </div>
    );
  }

  function renderExcelFiles() {
    if (!files) {
      return;
    }
    return files.map(renderExcelFile);
  }

  function renderExcelFile(file, i) {
    const { identifier, title, description } = file;
    const url = route.find('excel', { identifier });
    return (
      <div key={i}>
        <h4>
          <a href={url}>{title}</a>
        </h4>
      </div>
    );
  }

  function renderBlogResults() {
    if (!blogResults) {
      return;
    }
    return blogResults.map(renderBlogResult);
  }

  function renderBlogResult(result, i) {
    const { identifier, post } = result;
    const { slug, title, excerpt, date } = post;
    const url = route.find('blog-post', { identifier, slug });
    return (
      <div key={i}>
        <h4>
          <a href={url}>{rt(title)}</a>
        </h4>
      </div>
    );
  }
}
