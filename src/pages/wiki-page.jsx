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
        richTextAdjust: (type, props, children) => {
            if (type === 'a') {
                if (/^https?:/.test(props.href)) {
                    const target = '_blank';
                    props = { ...props, target };
                } else if (/^[\w\-]+$/.test(props.href)) {
                    const href = route.find('wiki', {
                        slug: props.href,
                        identifier: route.params.identifier,
                    });
                    props = { ...props, href };
                }
            }
            return { type, props, children };
        }
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
