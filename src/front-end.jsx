import React, { useMemo, useEffect } from 'react';
import { useListener, useEventTime, useEnvMonitor } from 'trambar-www';
import { DataSourceProxy, LocaleManagerProxy, RouteManagerProxy } from 'trambar-www';
import { Env } from 'trambar-www';
import { TopNavigation } from './widgets/top-navigation.jsx';
import { ErrorBoundary } from './widgets/error-boundary.jsx';

import './style.scss';

export function FrontEnd(props) {
  const { dataSource, routeManager, localeManager, ssr } = props;
  const [ dataChanged, setDataChanged ] = useEventTime();
  const [ routeChanged, setRouteChanged ] = useEventTime();
  const [ localeChanged, setLocaleChanged ] = useEventTime();
  const db = useMemo(() => {
    return new DataSourceProxy(dataSource);
  }, [ dataSource, dataChanged ]);
  const route = useMemo(() => {
    return new RouteManagerProxy(routeManager);
  }, [ routeManager, routeChanged ]);
  const locale = useMemo(() => {
    return new LocaleManagerProxy(localeManager);
  }, [ localeManager, localeChanged ]);
  const imageBaseURL = dataSource.options.baseURL;
  const env = useEnvMonitor({ locale, imageBaseURL, ssr });

  const handleLangChange = useListener((evt) => {
    localeManager.set(evt.lang);
  });

  useEffect(() => {
    dataSource.addEventListener('change', setDataChanged);
    routeManager.addEventListener('change', setRouteChanged);
    localeManager.addEventListener('change', setLocaleChanged);
    return () => {
      dataSource.removeEventListener('change', setDataChanged);
      routeManager.removeEventListener('change', setRouteChanged);
      localeManager.removeEventListener('change', setLocaleChanged);
    };
  }, [ dataSource, routeManager, localeManager ]);
  useEffect(() => {
    dataSource.log();
  }, [ dataSource ]);
  useEffect(() => {
    // reset scroll position unless route is old
    // (i.e. we've reached via back or forward button)
    const age = new Date - new Date(route.time);
    if (age < 200) {
      document.documentElement.scrollTop = 0;
    }
  }, [ route ]);

  const classNames = [ 'front-end' ];
  if (ssr) {
    classNames.push('ssr');
  }
  return (
    <Env.Provider value={env}>
      <div className={classNames.join(' ')}>
        {renderNavigation()}
        <div className="page-container">
          {renderCurrentPage()}
        </div>
      </div>
    </Env.Provider>
  );

  function renderNavigation() {
    const props = { db, route, onLangChange: handleLangChange };
    return (
      <ErrorBoundary>
        <TopNavigation {...props} />
      </ErrorBoundary>
    );
  }

  function renderCurrentPage() {
    const Page = route.params.module.default;
    const props = { db, route };
    return (
      <ErrorBoundary route={route}>
        <Page {...props} />
      </ErrorBoundary>
    );
  }
}
