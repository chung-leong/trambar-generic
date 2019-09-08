import React, { useCallback } from 'react';
import Relaks, { useProgress } from 'relaks';
import { useLanguageFilter } from 'trambar-www';

import './top-navigation.scss';

async function TopNavigation(props) {
    const { db, route, onLangChange } = props;
    const [ show ] = useProgress();
    const f = useLanguageFilter();

    const handleLanguageClick = useCallback((evt) => {
        const href = evt.target.getAttribute('href');
        const lang = href.substr(6);
        if (onLangChange) {
            onLangChange({ lang });
        }
        evt.preventDefault();
    }, [ onLangChange ]);

    render();
    const metadata = f(await db.fetchProjectMeta());
    render();
    const pages = await db.fetchWikiPages();
    render();
    const files = await db.fetchExcelFiles();
    render();
    const sites = await db.fetchWPSites();
    render();

    function render() {
        show(
            <div className="top-navigation">
                {renderLanguages()}
                {renderTitle()}
                {renderMenu()}
            </div>
        );
    }

    function renderTitle() {
        const title = (metadata) ? metadata.title : '\u00a0';
        return <h1 className="title">{title}</h1>;
    }

    function renderLanguages() {
        const languages = getLanguages(pages, files, sites);
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
                const label = getPageTitle(page);
                const url = route.find('wiki', {
                    identifier: page.identifier,
                    slug: page.slug,
                });
                buttons.push({ label, url });
            }
        }
        if (files) {
            for (let file of files) {
                const label = getFileTitle(file);
                const url = route.find('excel', {
                    identifier: file.identifier,
                });
                buttons.push({ label, url });
            }
        }
        if (sites) {
            for (let site of sites) {
                const label = site.name.plainText();
                const url = route.find('blog', {
                    identifier: site.identifier,
                });
                buttons.push({ label, url });
            }
        }
        return buttons.map(renderButton);
    }

    function renderButton(button, i) {
        return (
            <a className="button" href={button.url} key={i}>
                {button.label}
            </a>
        );
    }
}

function getPageTitle(page) {
    for (let block of page.blocks) {
        if (block.token.type === 'heading') {
            return block.token.markdown;
        }
    }
    return page.title;
}

function getFileTitle(file) {
    return file.title || file.name;
}

function getLanguages(...lists) {
    const languages = [];
    for (let list of lists) {
        if (list instanceof Array) {
            for (let object of list) {
                for (let language of object.languages()) {
                    if (languages.indexOf(language) === -1) {
                        languages.push(language);
                    }
                }
            }
        }
    }
    return languages;
}

const component = Relaks.memo(TopNavigation);

export {
    component as TopNavigation,
};
