import React, { useCallback } from 'react';
import Relaks, { useProgress, useLanguageFilter } from 'trambar-www';

import { LoadingAnimation } from '../widgets/loading-animation.jsx';

async function ProjectInformation(props) {
    const { db } = props;
    const [ show ] = useProgress();
    const f = useLanguageFilter();

    render();
    const metadata = f(await db.fetchProjectMeta());
    render();

    function render() {
        if (!metadata) {
            show(<LoadingAnimation />);
        } else {
            show(
                <div className="project-info">
                    <h2>{metadata.title}</h2>
                    <p>{metadata.description}</p>
                </div>
            );
        }
    }
}

const component = Relaks.memo(ProjectInformation);

export {
    component as ProjectInformation,
};
