import React, { useState } from 'react';
import Relaks, { useProgress, useLocalized, useRichText } from 'trambar-www';

import { LoadingAnimation } from '../widgets/loading-animation.jsx';

async function BlogContents(props) {
    const { db, route } = props;
    const { identifier, slug } = route.params;
    const [ show ] = useProgress();
    const t = useLocalized();
    const rt = useRichText({
        adjustFunc: (type, props, children) => {
            if (type === 'a' && props.href) {
                // see if link is to a page on the same site
                let href = props.href, path, target;
                if (href.startsWith('http:')) {
                    href = 'https:' + href.substr(5);
                }
                if (!/^\w+:/.test(href)) {
                    path = href;
                    href = site.url + href;
                } else if (href.startsWith(site.url)) {
                    path = href.substr(site.url.length);
                } else {
                    target = '_blank';
                }

                let linkSlug;
                if (path) {
                    // extract post slug from path
                    const m = /^\/([\w\-]+)\/?$/.exec(path);
                    if (m) {
                        linkSlug = m[1];
                    }
                }
                if (linkSlug) {
                    // redirect to internal URL
                    href = route.find('blog-post', { identifier, slug: linkSlug });
                } else {
                    target = '_blank';
                }
                props = { ...props, href, target };
            } else if (type === 'img' && props.src) {
                if (!/^\w+:/.test(props.src)) {
                    // make URL absolute
                    const src = site.url + props.src;
                    props = { ...props, src };
                }
            }
            return { type, props, children };
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
            const authorName = rt(author?.name);
            return (
                <React.Fragment>
                    <h2>{rt(post.title)}</h2>
                    <div className="date">{t(date)} - {authorName}</div>
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
