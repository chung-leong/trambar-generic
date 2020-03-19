import React from 'react';

import { ProjectInformation } from '../widgets/project-information.jsx';

function InfoPage(props) {
  return (
    <div className="info-page">
      <div className="contents">
        <ProjectInformation {...props} />
      </div>
    </div>
  );
}

export {
  InfoPage as default,
};
