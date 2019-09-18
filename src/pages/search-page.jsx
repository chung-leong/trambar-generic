import React from 'react';

import { SearchResults } from '../widgets/search-results.jsx';
import { SearchNavigation } from '../widgets/search-navigation.jsx';

import './search-page.scss';

function SearchPage(props) {
    const { route } = props;
    return (
        <div className="search-page">
            <div className="contents">
                <SearchResults {...props} key={route.url} />
            </div>
            <div className="side-bar">
                <SearchNavigation {...props} />
            </div>
        </div>
    );
}

export {
    SearchPage as default,
};
