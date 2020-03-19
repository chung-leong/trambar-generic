import React from 'react';
import { useLocalized } from 'trambar-www';

export function SearchNavigation(props) {
  const { route } = props;
  const { history } = route;
  const searches = [];
  const t = useLocalized();

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
      const heading = t(`Previous ${count === 1 ? 'search' : 'searches'}`);
      return (
        <div className="box">
          <h4>{heading}</h4>
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
