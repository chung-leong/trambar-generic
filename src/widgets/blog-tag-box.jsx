import React from 'react';
import Relaks, { useProgress } from 'relaks';
import { useRichText } from 'trambar-www';

import './blog-tag-box.scss';

async function BlogTagBox(props) {
    const { db, route, ids } = props;
    const { identifier } = route.params;
    const [ show ] = useProgress();
    const rt = useRichText();

    render();
    const tags = await db.fetchWPTags(identifier, ids);
    render();

    function render() {
        if (!tags || tags.length === 0) {
            show(<div className="blog-tag-box hidden" />);
        } else {
            show(
                <div className="blog-tag-box">
                    <h4>{renderTitle()}</h4>
                    <div className="tags">
                        {tags.map(renderTag)}
                    </div>
                </div>
            );
        }
    }

    function renderTitle() {
        return (ids.length === 1) ? 'Tag' : 'Tags';
    }

    function renderTag(tag, i) {
        const { slug } = tag;
        const url = route.find('blog-tag', { identifier, slug });
        const label = rt(tag.name);
        return <span key={i}><a href={url}>{label}</a></span>;
    }
}

const component = Relaks.memo(BlogTagBox);

export {
    component as BlogTagBox,
};
