import React, { useCallback } from 'react';
import { useProgress, usePlainText, useLocalized } from 'trambar-www';

import { SearchBox } from './search-box.jsx';

export async function TopNavigation(props) {
  const { db, route, onLangChange } = props;
  const [ show ] = useProgress();
  const t = useLocalized();
  const pt = usePlainText();

  const handleLanguageClick = useCallback((evt) => {
    const href = evt.target.getAttribute('href');
    const lang = href.substr(6);
    if (onLangChange) {
      onLangChange({ lang });
    }
    evt.preventDefault();
  }, [ onLangChange ]);

  render();
  const metadata = await db.fetchProjectMeta();
  render();
  const pages = await db.findWikiPages();
  render();
  const files = await db.findExcelFiles();
  render();
  const sites = await db.findWPSites();
  render();

  preloadPosts();

  async function preloadPosts() {
    for (let site of sites) {
      await db.fetchWPPosts(site.identifier);
    }
  }

  function render() {
    show(
      <div className="top-navigation">
        {renderLanguages()}
        {renderTitle()}
        {renderStatus()}
        {renderGitTag()}
        {renderMenu()}
        {renderSearchBox()}
      </div>
    );
  }

  function renderTitle() {
    const title = pt(metadata?.title) || '\u00a0';
    return <h1 className="title">{title}</h1>;
  }

  function renderStatus() {
    if (!metadata?.archived) {
      return;
    }
    return <h3 className="status">({t('Archived')})</h3>;
  }

  function renderGitTag() {
    const tag = route.context.commit;
    if (!tag) {
      return;
    }
    const tagAbbrev = /^\w{40}$/.test(tag) ? tag.substr(0, 8) : tag;
    return <h4 className="git-tag">({tagAbbrev})</h4>;
  }

  function renderLanguages() {
    const languages = [];
    for (let list of [ pages, files, sites ]) {
      if (list instanceof Array) {
        for (let object of list) {
          for (let language of object.getAvailableLanguages()) {
            console.log(language);
            if (languages.indexOf(language) === -1) {
              languages.push(language);
            }
          }
        }
      }
    }
    const children = [];
    for (let language of languages) {
      const key = children.length;
      const url = `?lang=${language}`;
      const link = (
        <a href={url} onClick={handleLanguageClick} key={key}>
          {language}
        </a>
      );
      children.push(link);
      children.push(' | ');
    }
    children.pop();
    return <div className="languages">{children}</div>;
  }

  function renderMenu() {
    const buttons = [];
    if (pages) {
      for (let page of pages) {
        const heading = page.blocks.find((block) => {
          return (block.token.type === 'heading');
        });
        const label = pt(heading) || page.title;
        const url = route.find('wiki', {
          identifier: page.identifier,
          slug: page.slug,
        });
        buttons.push({ label, url });
      }
    }
    if (files) {
      for (let file of files) {
        const label = pt(file.title) || file.identifier;
        const url = route.find('excel', {
          identifier: file.identifier,
        });
        buttons.push({ label, url });
      }
    }
    if (sites) {
      for (let site of sites) {
        const label = pt(site.name);
        const url = route.find('blog', {
          identifier: site.identifier,
        });
        buttons.push({ label, url });
      }
    }
    return (
      <div className="buttons">
        {buttons.map(renderButton)}
      </div>
    );
  }

  function renderButton(button, i) {
    return (
      <a className="button" href={button.url} key={i}>
        {button.label}
      </a>
    );
  }

  function renderSearchBox() {
    return <SearchBox route={route} />;
  }
}
