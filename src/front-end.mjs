import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useEventTime, useEnvMonitor, Env } from 'trambar-www';
import { Database } from './database.mjs';
import { Route } from './routing.mjs';

import { TopNavigation } from './widgets/top-navigation.jsx';

import './style.scss';

function FrontEnd(props) {
    const { dataSource, routeManager, ssr, lang } = props;
    const [ dataChanged, setDataChanged ] = useEventTime();
    const [ routeChanged, setRouteChanged ] = useEventTime();
    const db = useMemo(() => {
        return new Database(dataSource);
    }, [ dataSource, dataChanged ]);
    const route = useMemo(() => {
        return new Route(routeManager);
    }, [ routeManager, routeChanged ]);
    const [ language, setLanguage ] = useState(lang);
    const imageBaseURL = dataSource.options.baseURL
    const env = useEnvMonitor({ ssr, language, imageBaseURL });

    const handleLangChange = useCallback((evt) => {
        setLanguage(evt.lang);
    });

    useEffect(() => {
        dataSource.addEventListener('change', setDataChanged);
        routeManager.addEventListener('change', setRouteChanged);
        return () => {
            dataSource.removeEventListener('change', setDataChanged);
            routeManager.removeEventListener('change', setRouteChanged);
        };
    }, [ dataSource, routeManager ]);
    useEffect(() => {
        dataSource.log();
    }, []);
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
        return <TopNavigation {...props} />;
    }

    function renderCurrentPage() {
        const Page = route.params.module.default;
        const props = { db, route };
        return <Page {...props} />;
    }
}

export {
    FrontEnd,
};
