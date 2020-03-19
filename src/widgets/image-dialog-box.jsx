import React, { useState } from 'react';
import { useLocalized, useRichText, useEnv } from 'trambar-www';

export function ImageDialogBox(props) {
  const { database, image, onClose } = props;
  const env = useEnv();
  const t = useLocalized();
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
          <button onClick={onClose}>{t('Close')}</button>
        </div>
      </div>
    );
  }
}
