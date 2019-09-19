import React, { useState } from 'react';
import Relaks, { useListener } from 'relaks';
import { useRichText } from 'trambar-www';

import { Overlay } from './overlay.jsx';

function ImageDialogBox(props) {
    const { database, image, onClose } = props;
    const rt = useRichText({
        imageWidth: 400,
    });

    return (
        <div className="image-dialog-box">
            {renderImage()}
            {renderButtons()}
        </div>
    );

    function renderImage() {
        if (image) {
            const viewportWidth = document.body.clientWidth;
            const viewportHeight = document.body.clientHeight;
            const maxWidth = viewportWidth - 100;
            const maxHeight = viewportHeight - 150;
            const maxAspectRatio = maxWidth / maxHeight;
            const aspectRation = image.width / image.height;
            let imageWidth, imageHeight;
            if (aspectRation > maxAspectRatio) {
                imageWidth = Math.min(maxWidth, image.width);
            } else {
                imageHeight = Math.min(maxHeight, image.height);
            }
            const options = {
                //devicePixelRatio: env.devicePixelRatio,
                imageWidth,
                imageHeight,
                //imageBaseURL: env.address,
            };
            return rt(image);
        }
    }

    function renderButtons() {
        return (
            <div className="buttons">
                <div className="left">
                </div>
                <div className="right">
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        );
    }
}

const component = Overlay.create(ImageDialogBox);

export {
    component as ImageDialogBox,
};
