import React from 'react';

import { ExcelContents } from '../widgets/excel-contents.jsx';

function ExcelPage(props) {
    const { route } = props;
    return (
        <div className="blog-category-page">
            <div className="contents">
                <ExcelContents {...props} key={route.url} />
            </div>
        </div>
    );
}

export {
    ExcelPage as default,
};
