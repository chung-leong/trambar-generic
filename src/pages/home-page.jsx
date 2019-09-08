import React from 'react';
import Relaks, { useProgress } from 'relaks';

import './home-page.scss';

async function HomePage(props) {
    const [ show ] = useProgress();

    render();

    function render() {
        show(
            <div>
                <h1>Home page</h1>
            </div>
        );
    }
}

const component = Relaks.memo(HomePage);

export {
    component as default,
};
