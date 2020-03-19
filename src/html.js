import React from 'react';
import Relaks, { useProgress, usePlainText } from 'trambar-www';

export async function HTML(props) {
  const { dataSource } = props;
  const [ show ] = useProgress();
  const pt = usePlainText();

  render();
  const metadata = await dataSource.fetchProjectMeta();
  render();

  function render() {
    if (!metadata) {
      show(null);
    } else {
      show(
        <html>
          <head>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>{pt(metadata.title)}</title>
            <link href="main.css" rel="stylesheet" />
          </head>
          <body>
            <div id="react-container" />
            <script type="text/javascript" src="index.js" />
          </body>
        </html>
      );
    }
  }
}
