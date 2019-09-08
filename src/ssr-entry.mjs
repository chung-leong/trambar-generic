import { createElement } from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { harvest } from 'relaks-harvest';
import { start } from './services.mjs';
import { FrontEnd } from './front-end.mjs';
import { HTML } from './html.mjs';

async function render(options) {
    const services = await start(options);
    const attrs = { ssr: options.ssrTarget, lang: options.preferredLanguage };
    const contents = await renderFrontEnd(services, attrs);
    const script = packageOptions(options);
    const htmlTemplate = await renderTemplate(services, attrs);
    const html = fillTemplate(htmlTemplate, contents, script);
    return html;
}

/**
 * Render the front-end. Catch any error so that the code will still run
 * on the client side. The same error will occur there again, which we can
 * more easily debug in Chrome's development console
 *
 * @param  {Object} services
 * @param  {Object} attrs
 *
 * @return {Promise<String\Error>}
 */
async function renderFrontEnd(services, attrs) {
    try {
        const ssrElement = createElement(FrontEnd, { ...services, ...attrs });
        const rootNode = await harvest(ssrElement);
        const html = renderToString(rootNode);
        return html;
    } catch (err) {
        return err;
    }
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
        const pre = `<pre>${err.stack}</pre>`;
        return before + pre + openTag + closeTag + script + after;
    } else {
        return before + openTag + contents + closeTag + script + after;
    }
}

export {
    render,
};
