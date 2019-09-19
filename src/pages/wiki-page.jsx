import React from 'react';

import { WikiContents } from '../widgets/wiki-contents.jsx';
import { WikiNavigation } from '../widgets/wiki-navigation.jsx';

function WikiPage(props) {
    const { route } = props;
    return (
        <div className="wiki-page">
            <div className="contents">
                <WikiContents {...props} key={route.url} />
            </div>
            <div className="side-bar">
                <WikiNavigation {...props} />
            </div>
        </div>
    );
}

export {
    WikiPage as default,
};
