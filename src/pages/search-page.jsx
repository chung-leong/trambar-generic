import React from 'react';

import { SearchResults } from '../widgets/search-results.jsx';
import { SearchNavigation } from '../widgets/search-navigation.jsx';

export function SearchPage(props) {
  return (
    <div className="search-page">
      <div className="contents">
        <SearchResults {...props} key={props.route.url} />
      </div>
      <div className="side-bar">
        <SearchNavigation {...props} />
      </div>
    </div>
  );
}
