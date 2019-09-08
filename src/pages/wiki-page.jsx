import React from 'react';
import Relaks, { useProgress } from 'relaks';
import { useRichText, useLanguageFilter } from 'trambar-www';

import { LoadingAnimation } from '../widgets/loading-animation.jsx';

import './wiki-page.scss';

async function WikiPage(props) {
    const { db, route } = props;
    const { identifier, slug } = route.params;
    const [ show ] = useProgress();
    const rt = useRichText({
        imageHeight: 24,
    });
    const f = useLanguageFilter();

    render();
    const page = f(await db.fetchWikiPage(identifier, slug));
    render();

    function render() {
        if (!page) {
            show(<LoadingAnimation />);
        } else {
            show(<div className="wiki-page">{rt(page)}</div>);
        }
    }
}

const component = Relaks.memo(WikiPage);

export {
    component as default,
};
