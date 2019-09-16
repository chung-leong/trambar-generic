import React from 'react';

import './search-history-box.scss';

function SearchHistoryBox(props) {
    const { route } = props;
    const { history } = route;
    const searches = [];

    const exists = {};
    if (route.name === 'search') {
        exists[route.params.search] = true;
    }
    for (let item of history) {
        if (item.name === 'search') {
            if (!exists[item.params.search]) {
                searches.push(item);
                exists[item.params.search] = true;
            }
        }
    }

    if (searches.length === 0) {
        return <div className="search-history-box hidden" />;
    } else {
        return (
            <div className="search-history-box">
                <h4>{renderTitle()}</h4>
                <ul className="categories">
                    {searches.map(renderSearch)}
                </ul>
            </div>
        );
    }

    function renderTitle() {
        return (searches.length === 1) ? 'Previous search' : 'Previous searches';
    }

    function renderSearch(search, i) {
        const { name, params } = search;
        const url = route.find(name, params);
        const label = params.search;
        return (
            <li key={i}>
                <a href={url}>{label}</a>
            </li>
        );
    }
}

export {
    SearchHistoryBox,
};
