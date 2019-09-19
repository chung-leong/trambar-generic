import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useEventTime } from 'relaks';
import { Env, useEnvMonitor } from 'trambar-www';
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
    const [ currentLanguage, setCurrentLanguage ] = useState(lang);
    const env = useEnvMonitor({
        imageBaseURL: dataSource.options.baseURL,
        language: currentLanguage,
        ssr,
    });

    const handleLangChange = useCallback((evt) => {
        setCurrentLanguage(evt.lang);
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
