import React from 'react';
import { useLocalized } from 'trambar-www';

import UnicornURL from '../assets/unicorn.svg';

function MissingPage(props) {
    const t = useLocalized();
    return (
        <div className="missing-page">
            <div className="graphic">
                <img className="unicorn" src={UnicornURL} />
            </div>
            <div className="text">
                <h1 className="title">404 {t("Not Found")}</h1>
                <p>
                    {t("The page you're trying to reach doesn't exist.")}
                    {' '}
                    {t("But then again, who does?")}
                </p>
            </div>
        </div>
    );
}

export {
    MissingPage as default,
};
