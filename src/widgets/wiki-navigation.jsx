import React, { useState } from 'react';
import Relaks, { useProgress } from 'relaks';
import { useRichText } from 'trambar-www';

import './wiki-navigation.scss';

async function WikiNavigation(props) {
    const { db, route } = props;
    const { identifier, slug } = route.params;
    const [ show ] = useProgress();
    const rt = useRichText();

    render();
    const page = await db.fetchWikiPage(identifier, slug);
    const related = await fetchRelated();
    render();

    async function fetchRelated() {
        const list = [];
        const slugs = page.links();
        for (let slug of slugs) {
            try {
                const other = await db.fetchWikiPage(identifier, slug);
                list.push(other);
            } catch (err) {
            }
        }
        return list;
    }

    function render() {
        show(
            <div className="blog-navigation">
                {renderPageBox()}
            </div>
        );
    }

    function renderPageBox() {
        const count = (related) ? related.length : 0;
        if (count === 0) {
            return <div className="box hidden" />;
        } else {
            return (
                <div className="box">
                    <h4>Related {(count === 1) ? 'article' : 'articles'}</h4>
                    <ul className="pages">
                        {related.map(renderPage)}
                    </ul>
                </div>
            );
        }
    }

    function renderPage(page, i) {
        const { slug, title } = page;
        const url = route.find('wiki', { identifier, slug });
        return <li key={i}><a href={url}>{title}</a></li>;
    }
}

const component = Relaks.memo(WikiNavigation);

export {
    component as WikiNavigation,
};
