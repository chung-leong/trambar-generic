import React, { useState } from 'react';
import Relaks, { useListener } from 'relaks';
import { useRichText, useEnv } from 'trambar-www';

import { Overlay } from './overlay.jsx';

function ImageDialogBox(props) {
    const { database, image, onClose } = props;
    const env = useEnv();
    const rt = useRichText({
        imageMaxWidth: env.viewportWidth - 100,
        imageMaxHeight: env.viewportHeight - 150,
    });

    return (
        <div className="image-dialog-box">
            {renderImage()}
            {renderButtons()}
        </div>
    );

    function renderImage() {
        if (image) {
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
