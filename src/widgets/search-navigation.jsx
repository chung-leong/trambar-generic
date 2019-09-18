import React from 'react';

import './search-navigation.scss';

function SearchNavigation(props) {
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
                searches.unshift(item);
                exists[item.params.search] = true;
            }
        }
    }

    return (
        <div className="search-navigation">
            {renderHistoryBox()}
        </div>
    );

    function renderHistoryBox() {
        const count = searches.length;
        if (count === 0) {
            return <div className="box hidden" />;
        } else {
            return (
                <div className="box">
                    <h4>Previous {(count === 1) ? 'search' : 'searches'}</h4>
                    <ul className="categories">
                        {searches.map(renderSearch)}
                    </ul>
                </div>
            );
        }
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
    SearchNavigation,
};