import React, { useCallback } from 'react';
import Relaks, { useProgress, usePlainText } from 'trambar-www';

import { LoadingAnimation } from '../widgets/loading-animation.jsx';

export async function ProjectInformation(props) {
  const { db } = props;
  const [ show ] = useProgress();
  const pt = usePlainText();

  render();
  const metadata = await db.fetchProjectMeta();
  render();

  function render() {
    if (!metadata) {
      show(<LoadingAnimation />);
    } else {
      show(
        <div className="project-info">
          <h2>{pt(metadata.title)}</h2>
          <p>{pt(metadata.description)}</p>
        </div>
      );
    }
  }
}
