import React from 'react';

import { ExcelContents } from '../widgets/excel-contents.jsx';

export function ExcelPage(props) {
  return (
    <div className="blog-category-page">
      <div className="contents">
        <ExcelContents {...props} key={props.route.url} />
      </div>
    </div>
  );
}
