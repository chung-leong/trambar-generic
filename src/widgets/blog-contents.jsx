import React, { useState } from 'react';
import Relaks, { useProgress, useRichText, useEnv } from 'trambar-www';

import { LoadingAnimation } from '../widgets/loading-animation.jsx';

async function BlogContents(props) {
    const { db, route } = props;
    const { identifier, slug } = route.params;
    const [ show ] = useProgress();
    const env = useEnv();
    const rt = useRichText({
        richTextAdjust: (type, props, children) => {
            if (type === 'a' && props.href) {
                let linkSlug;
                if (props.href.startsWith(site.url)) {
                    const path = props.href.substr(site.url.length);
                    const m = /^\/([\w\-]+)\/?$/.exec(path);
                    if (m) {
                        linkSlug = m[1];
                    }
                }
                if (linkSlug) {
                    const href = route.find('blog-post', { identifier, slug: linkSlug });
                    props = { ...props, href, target: undefined };
                } else {
                    const target = '_blank';
                    props = { ...props, target: '_blank' };
                }
                return { type, props, children };
            }
        }
    });

    render();
    const site = await db.fetchWPSite(identifier);
    const post = await db.fetchWPPost(identifier, slug);
    render();
    const author = await db.fetchWPUser(identifier, post.author);
    render();

    function render() {
        show(
            <div className="blog-contents">
                {renderContents()}
            </div>
        );
    }

    function renderContents() {
        if (!post) {
            return <LoadingAnimation />;
        } else {
            const { date } = post;
            const dateStr = date.toLocaleDateString(env.language);
            const authorName = (author) ? rt(author.name) : '';
            return (
                <React.Fragment>
                    <h2>{rt(post.title)}</h2>
                    <div className="date">{dateStr} - {authorName}</div>
                    <div className="article">
                        {rt(post.content)}
                    </div>
                </React.Fragment>
            );
        }
    }
}

const component = Relaks.memo(BlogContents);

export {
    component as BlogContents,
};
