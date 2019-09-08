var FS = require('fs');
var Path = require('path');
var CrossFetch = require('cross-fetch');
var HTTP = require('http');
var OS = require('os');
var ReadlineSync = require('readline-sync');

module.exports = {
    before: function(app, server) {
        var fs = server.middleware.fileSystem;
        var contentBase = server.options.contentBase;
        var baseURL = getBaseURL();

        app.get('/*', function(req, res, next) {
            var path = req.params[0];
            var m = /\.\w+$/.exec(path);
            if (!m) {
                return next();
            }
            var ext = m[0];
            var filename = Path.basename(path);

            server.middleware.waitUntilValid(function() {
                try {
                    var filePath = contentBase + '/www/' + filename;
                    var buffer = fs.readFileSync(filePath);
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
            var path = req.path;
            var lang = getPreferredLanguage(req);

            server.middleware.waitUntilValid(function() {
                try {
                    var codePath = contentBase + '/ssr/index.js';
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
            // include index.js in error page, so auto-reload works
            var html = `
                <!DOCTYPE html>
                <html>
                    <head>
                        <meta charSet="UTF-8" />
                        <title>${err.message}</title>
                        <link href="main.css" rel="stylesheet" />
                    </head>
                    <body>
                        <pre>${err.stack || err.message}</pre>
                        <script type="text/javascript" src="index.js"></script>
                    </body>
                </html>
            `;
            res.status(500).type('html').send(html);
        });
    }
}

function getBaseURL() {
    var exts = [ '.desktop', '.url' ];
    for (var i = 0; i < exts.length; i++) {
        var ext = exts[i];
        var filename = 'test-server' + ext;
        var path = Path.resolve('./' + filename);
        if (FS.existsSync(path)) {
            var text = FS.readFileSync(path, 'utf-8');
            var m = /^URL=(.*)$/mi.exec(text);
            if (m) {
                return m[1];
            }
        }
    }
    var url = '';
    var prompt = 'Server URL: ';
    do {
        url = ReadlineSync.question(prompt).trim();
    } while(!url);
    saveBaseURL(url);
    return url;
}

function saveBaseURL(url) {
    var ext = '.url';
    var nl = '\n';
    var lines = [];
    switch (OS.platform()) {
        case 'win32':
            lines.push('[InternetShortcut]');
            nl = '\r\n';
            break;
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
    }
    lines.push('URL=' + url);
    var text = lines.join(nl);
    var filename = 'test-server' + ext;
    var path = Path.resolve('./' + filename);
    FS.writeFileSync(path, text);
}

function generatePage(fs, codePath, path, lang, baseURL) {
    var buffer = fs.readFileSync(codePath);
    var dirname = Path.dirname(codePath);
    var filename = Path.basename(codePath);
    var ssr = compileCode(buffer, dirname, filename);
    var fetchFunc = function(url, optionsGiven) {
        var fetchOptions = {
            timeout: 5000,
        };
        if (optionsGiven instanceof Object) {
            for (var key in optionsGiven) {
                fetchOptions[key] = optionsGiven[key];
            }
        }
        return CrossFetch(url, fetchOptions);
    };
    var options = {
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

function compileCode(buffer, dirname, filename) {
    var code = buffer.toString();
    var cjsHeader = '(function(require, exports, module, __dirname, __filename) {\n';
    var cjsTrailer = '\n})';
    var cjs = cjsHeader + code + cjsTrailer;
    var f = eval(cjs);
    var module = { exports: {} };
    f(require, module.exports, module, dirname, filename);
    return module.exports;
}

function getPreferredLanguage(req) {
    var accept = req.headers['accept-language'] || 'en';
    var tokens = accept.split(/\s*,\s*/);
    var list = tokens.map(function(token) {
        var m = /([^;]+);q=(.*)/.exec(token);
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
