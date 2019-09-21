import React, { useState } from 'react';
import Relaks, { useProgress, useRichText } from 'trambar-www';

import { LoadingAnimation } from '../widgets/loading-animation.jsx';

async function BlogContents(props) {
    const { db, route } = props;
    const { identifier, slug } = route.params;
    const [ show ] = useProgress();
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
            return (
                <React.Fragment>
                    <h2>{rt(post.title)}</h2>
                    {rt(post.content)}
                </React.Fragment>
            );
        }
    }
}

const component = Relaks.memo(BlogContents);

export {
    component as BlogContents,
};
