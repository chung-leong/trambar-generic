import { createElement } from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { harvest } from 'trambar-www';
import { start } from './services.mjs';
import { FrontEnd } from './front-end.mjs';
import { HTML } from './html.mjs';

async function render(options) {
    const services = await start(options);
    const attrs = { ssr: options.ssrTarget };
    const htmlTemplate = await renderTemplate(services, attrs);
    const script = packageOptions(options);
    try {
        const contents = await renderFrontEnd(services, attrs);
        const html = fillTemplate(htmlTemplate, contents, script);
        return html;
    } catch (err) {
        // Use the generated HTML as the error message so our JS code would
        // still run on the client side. The same error will occur there again,
        // which we can more easily debug in Chrome's development console than
        // in Node.js
        const html = fillTemplate(htmlTemplate, err, script);
        const htmlError = new Error(html);
        htmlError.html = true;
        htmlError.status = err.status;
        throw htmlError;
    }
}

/**
 * Render the front-end
 *
 * @param  {Object} services
 * @param  {Object} attrs
 *
 * @return {Promise<String\Error>}
 */
async function renderFrontEnd(services, attrs) {
    const ssrElement = createElement(FrontEnd, { ...services, ...attrs });
    const rootNode = await harvest(ssrElement);
    const html = renderToString(rootNode);
    return html;
}

/**
 * Package options in a script tag so the parameters used for SSR can be used
 * on the client side
 *
 * @param  {Object} options
 *
 * @return {String}
 */
function packageOptions(options) {
    const json = JSON.stringify({
        dataSourceBaseURL: options.dataSourceBaseURL,
        routeBasePath: options.routeBasePath,
        ssrTarget: options.ssrTarget,
        preferredLanguage: options.preferredLanguage,
    });
    return `<script>window.ssrOptions = ${json}</script>`;
}

/**
 * Render template for HTML stub.
 *
 * @param  {Object} services
 * @param  {Object} attrs
 *
 * @return {Promise<String>}
 */
async function renderTemplate(services, attrs) {
    const htmlElement = createElement(HTML, { ...services, ...attrs });
    const htmlNode = await harvest(htmlElement);
    const html = renderToStaticMarkup(htmlNode);
    return html;
}

/**
 * Insert SSR contents into HTML template
 *
 * @param  {String} html
 * @param  {String|Error} contents
 * @param  {String} script
 *
 * @return {String}
 */
function fillTemplate(html, contents, script) {
    // find React container
    const m = /(<\w+\s+id="react-container".*?>)(<\/\w+>)/.exec(html);
    if (!m) {
        throw new Error('Unable to find React container');
    }
    const before = html.substr(0, m.index);
    const openTag = m[1], closeTag = m[2]
    const after = html.substr(m.index + m[0].length);

    const err = (contents instanceof Error) ? contents : null;
    if (err) {
        // place the error stack in front of the React container
        const msg =  getErrorMessage(err);
        const pre = `<pre id="ssr-error">${msg}</pre>`;
        return before + pre + openTag + closeTag + script + after;
    } else {
        return before + openTag + contents + closeTag + script + after;
    }
}

/**
 * Return appropriate error message
 *
 * @param  {Error} err
 *
 * @return {String}
 */
function getErrorMessage(err) {
    if (process.env.NODE_ENV !== 'production') {
        // show call stack during development
        return err.stack || err.message;
    } else {
        // don't show 404 error message since that's handled on the client-side
        // by routing to MissingPage
        return (err.status === 404) ? '' : err.message;
    }
}

export {
    render,
};
