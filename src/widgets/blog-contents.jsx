import React, { useState } from 'react';
import Relaks, { useProgress } from 'relaks';
import { useRichText } from 'trambar-www';

import { LoadingAnimation } from '../widgets/loading-animation.jsx';

async function BlogContents(props) {
    const { db, route } = props;
    const { identifier, slug } = route.params;
    const [ show ] = useProgress();
    const rt = useRichText();

    render();
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
