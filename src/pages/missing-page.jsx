import React from 'react';
import { harvesting, useLocalized } from 'trambar-www';

import Unicorn from '../assets/unicorn.svg';

export function MissingPage(props) {
  if (harvesting()) {
    // throw 404 error during server-side rendering so the
    // correct status code is sent to the browser
    const error = new Error('Not Found');
    error.status = 404;
    throw error;
  }

  const t = useLocalized();
  return (
    <div className="missing-page">
      <div className="graphic">
        <Unicorn />
      </div>
      <div className="text">
        <h1 className="title">404 {t("Not Found")}</h1>
        <p>
          {t("The page you're trying to reach doesn't exist.")}
          {' '}
          {t("But then again, who does?")}
        </p>
      </div>
    </div>
  );
}
