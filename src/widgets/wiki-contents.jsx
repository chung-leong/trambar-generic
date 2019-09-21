import React, { useState } from 'react';
import Relaks, { useProgress, useListener, useRichText, useLanguageFilter } from 'trambar-www';

import { LoadingAnimation } from '../widgets/loading-animation.jsx';
import { ImageDialogBox } from '../widgets/image-dialog-box.jsx';

async function WikiContents(props) {
    const { db, route } = props;
    const { identifier, slug } = route.params;
    const [ show ] = useProgress();
    const [ selectedImage, setSelectedImage ] = useState(null);
    const rt = useRichText({
        imageHeight: 24,
        richTextAdjust: (type, props, children) => {
            if (type === 'a') {
                if (/^https?:/.test(props.href)) {
                    props = { ...props, target: '_blank' };
                } else if (/^[\w\-]+$/.test(props.href)) {
                    const href = route.find('wiki', { identifier, slug: props.href });
                    props = { ...props, href };
                }
                return { type, props, children };
            }
        }
    });
    const f = useLanguageFilter();

    const handleContentsClick = useListener((evt) => {
        const { tagName, src } = evt.target;
        if (tagName === 'IMG') {
            const image = page.image(src);
            if (image) {
                setSelectedImage(image);
            }
        }
    });
    const handleDialogClose = useListener((evt) => {
        setSelectedImage(null);
    });

    render();
    const page = f(await db.fetchWikiPage(identifier, slug));
    render();

    function render() {
        if (!page) {
            show(<LoadingAnimation />);
        } else {
            show(
                <div className="wiki-contents" onClick={handleContentsClick}>
                    {rt(page)}
                    {renderDialogBox()}
                </div>
            );
        }
    }

    function renderDialogBox() {
        const props = {
            show: !!selectedImage,
            image: selectedImage,
            onClose: handleDialogClose,
        };
        return <ImageDialogBox {...props} />;
    }
}

const component = Relaks.memo(WikiContents);

export {
    component as WikiContents,
};
