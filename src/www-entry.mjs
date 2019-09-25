import { createElement } from 'react';
import { hydrate, render } from 'react-dom';
import { harvest, plant } from 'trambar-www';
import { start } from './services.mjs';
import { FrontEnd } from './front-end.mjs';

window.addEventListener('load', initialize);

async function initialize(evt) {
    const options = window.ssrOptions;
    const services = await start(options);
    const attrs = { ssr: options.ssrTarget };
    const container = document.getElementById('react-container');
    await renderSSR(container, services, attrs);
    await renderCSR(container, services, attrs);
}

/**
 * Render page contents in the same manner as on the server. Use relaks-harvest
 * to collect final contents of asynchronous components. "plant" contents into
 * Relaks so asynchrous components would yield their contents immediately.
 *
 * @param  {HTMLElement} container
 * @param  {Object} services
 * @param  {Object} attrs
 *
 * @return {Promise}
 */
async function renderSSR(container, services, attrs) {
    const ssrError = document.getElementById('ssr-error');
    if (ssrError) {
        // remove the error message when the route changes
        const { routeManager } = services;
        const initialURL = routeManager.url;
        const removeSSRError = () => {
            if (routeManager.url !== initialURL) {
                routeManager.removeEventListener('change', removeSSRError);
                ssrError.remove();
            }
        };
        routeManager.addEventListener('change', removeSSRError);

        // If an error occurs on the server side, there's no point in
        // attempting to rehydrate, since we'll just run into the same error
        // (the DOM is empty in any event). We'll most likely encounter that
        // error again in CSR mode.
        return;
    }
    const element = createElement(FrontEnd, { ...services, ...attrs });
    const seeds = await harvest(element, { seeds: true });
    plant(seeds);
    hydrate(element, container);
}

/**
 * Rerendering in CSR mode, changing prop ssr to undefined.
 *
 * @param  {HTMLElement} container
 * @param  {Object} services
 * @param  {Object} attrs
 *
 * @return {Promise}
 */
async function renderCSR(container, services, attrs) {
    attrs = { ...attrs, ssr: undefined };
    const element = createElement(FrontEnd, { ...services, ...attrs });
    render(element, container);
}
