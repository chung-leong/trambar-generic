import React, { useState } from 'react';
import Relaks, { useProgress } from 'relaks';
import { useRichText, useDateText } from 'trambar-www';

import { LoadingAnimation } from '../widgets/loading-animation.jsx';
import { SearchHistoryBox } from '../widgets/search-history-box.jsx';

import './search-page.scss';

async function SearchPage(props) {
    const { db, route } = props;
    const { identifier, search } = route.params;
    const [ show ] = useProgress();
    const rt = useRichText();

    render();
    const wikis = await db.fetchWikiPagesSearch(search);
    render();
    const files = await db.fetchExcelFilesSearch(search);
    render();
    const posts = await db.fetchWPPostsSearch(search);
    render();

    function render() {
        if (!wikis) {
            show(<LoadingAnimation />);
        } else {
            show(
                <div className="blog-page">
                    <div className="contents">
                        {renderTitle()}
                        {renderWikis()}
                        {renderExcelFiles()}
                        {renderPosts()}
                    </div>
                    <div className="side-bar">
                        {renderSearchHistoryBox()}
                    </div>
                </div>
            );
        }
    }

    function renderTitle() {
        return <h2>Search results: (1)</h2>;
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
                <p>{description}</p>
            </div>
        );
    }

    function renderPosts() {
        if (!posts) {
            return;
        }
        return posts.map(renderPost);
    }

    function renderPost(post, i) {
        const { slug, title, excerpt, date } = post;
        const url = route.find('blog-post', { identifier, slug });
        return (
            <div key={i}>
                <h4>
                    <a href={url}>{rt(title)}</a>
                </h4>
                {rt(excerpt)}
            </div>
        );
    }

    function renderSearchHistoryBox() {
        const props = { route };
        return <SearchHistoryBox {...props} />;
    }
}

const component = Relaks.memo(SearchPage);

export {
    component as default,
};
