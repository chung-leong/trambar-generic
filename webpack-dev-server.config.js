const FS = require('fs');
const Path = require('path');
const URL = require('url');
const CrossFetch = require('cross-fetch');
const HTTP = require('http');
const OS = require('os');
const ReadlineSync = require('readline-sync');

module.exports = {
  before: function(app, server) {
    const fs = server.middleware.fileSystem;
    const contentBase = server.options.contentBase;
    const baseURL = getBaseURL();

    app.get('/*', function(req, res, next) {
      const path = req.params[0];
      const m = /\.\w+$/.exec(path);
      if (!m) {
        return next();
      }
      const ext = m[0];
      const filename = Path.basename(path);

      server.middleware.waitUntilValid(function() {
        try {
          const filePath = contentBase + '/www/' + filename;
          const buffer = fs.readFileSync(filePath);
          res.type(ext).send(buffer);
        } catch (err) {
          if (filename === 'favicon.ico') {
            res.sendStatus(204);
            return;
          }
          next(err);
        }
      });
    });
    app.get('/*', function(req, res, next) {
      const path = req.url;
      const lang = getPreferredLanguage(req);

      server.middleware.waitUntilValid(function() {
        try {
          const codePath = contentBase + '/ssr/index.js';
          generatePage(fs, codePath, path, lang, baseURL).then(function(html) {
            res.type('html').send(html);
          }).catch(function(err) {
            next(err);
          });
        } catch (err) {
          next(err);
        }
      });
    });
  },
  after: function(app, server) {
    app.use(function(err, req, res, next) {
      let html;
      if (err.html) {
        // show the HTML error message that the template has prepared
        html = err.message;
      } else {
        // the template blew up before it reached the front-end code
        // include index.js in the error page, so auto-reload works
        html = `
          <!DOCTYPE html>
          <html>
            <body>
              <pre>${err.stack || err.message}</pre>
              <script type="text/javascript" src="index.js"></script>
            </body>
          </html>
        `;
      }
      res.status(err.status || 500).type('html').send(html);
    });
  }
}

function getBaseURL() {
  const exts = [ '.desktop', '.url' ];
  for (let ext of exts) {
    const filename = `test-server${ext}`;
    const path = Path.resolve(`./${filename}`);
    if (FS.existsSync(path)) {
      const text = FS.readFileSync(path, 'utf-8');
      const m = /^URL=(.*)$/mi.exec(text);
      if (m) {
        return m[1];
      }
    }
  }
  const prompt = 'Server URL: ';
  let url = '';
  do {
    url = ReadlineSync.question(prompt).trim();
    const parsed = URL.parse(url);
    if (!parsed.hostname || !parsed.protocol) {
      console.log('[Invalid URL]');
      url = null;
    }
  } while(!url);
  saveBaseURL(url);
  return url;
}

function saveBaseURL(url) {
  const lines = [];
  let ext = '.url';
  let nl = '\n';
  switch (OS.platform()) {
    case 'linux':
    case 'freebsd':
      lines.push(
        '[Desktop Entry]',
        'Encoding=UTF-8',
        'Name=Link to test server',
        'Type=Link',
        'Icon=text-html'
      );
      ext = '.desktop';
      break;
    default:
      lines.push('[InternetShortcut]');
      nl = '\r\n';
      break;
  }
  lines.push('URL=' + url);
  const text = lines.join(nl);
  const filename = `test-server${ext}`;
  const path = Path.resolve(`./${filename}`);
  FS.writeFileSync(path, text);
}

function generatePage(fs, codePath, path, lang, baseURL) {
  const buffer = fs.readFileSync(codePath);
  const dirname = Path.dirname(codePath);
  const filename = Path.basename(codePath);
  const ssr = compileCode(buffer, dirname, filename);
  const fetchFunc = function(url, optionsGiven) {
    const fetchOptions = {
      timeout: 5000,
    };
    if (optionsGiven instanceof Object) {
      for (var key in optionsGiven) {
        fetchOptions[key] = optionsGiven[key];
      }
    }
    return CrossFetch(url, fetchOptions);
  };
  const options = {
    dataSourceBaseURL: baseURL,
    routeBasePath: '/',
    routePagePath: path,
    ssrTarget: 'hydrate',
    preferredLanguage: lang,
    fetchFunc: fetchFunc,
  };
  return ssr.render(options).then(function(html) {
    return '<!DOCTYPE html>\n' + html;
  });
}

/**
 * Compile a CommonJS module
 * @param  {Buffer} buffer
 * @param  {string} dirname
 * @param  {string} filename
 *
 * @return {Object}
 */
function compileCode(buffer, dirname, filename) {
  const code = buffer.toString();
  const cjsHeader = '(function(require, exports, module, __dirname, __filename) {\n';
  const cjsTrailer = '\n})';
  const cjs = cjsHeader + code + cjsTrailer;
  const f = evalArg(cjs);
  const module = { exports: {} };
  f(require, module.exports, module, dirname, filename);
  return module.exports;
}

/**
 * Evaluate code in clean context
 *
 * @return {Function}
 */
function evalArg() {
  return eval(arguments[0]);
}

/**
 * Return language most preferred by visitor
 * @param  {Request} req
 *
 * @return {string}
 */
function getPreferredLanguage(req) {
  const accept = req.headers['accept-language'] || 'en';
  const tokens = accept.split(/\s*,\s*/);
  const list = tokens.map(function(token) {
    const m = /([^;]+);q=(.*)/.exec(token);
    if (m) {
      return { language: m[1], qFactor: parseFloat(m[2]) };
    } else {
      return { language: token, qFactor: 1 };
    }
  });
  list.sort(function(a, b) {
    return b.qFactor - a.qFactor;
  });
  return list[0].language;
}
