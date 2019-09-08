import React, { useState } from 'react';
import Relaks, { useProgress } from 'relaks';
import { useRichText, useLanguageFilter } from 'trambar-www';

import { LoadingAnimation } from '../widgets/loading-animation.jsx';

import './excel-page.scss';

async function ExcelPage(props) {
    const { db, route } = props;
    const { identifier } = route.params;
    const [ show ] = useProgress();
    const [ limit, setLimit ] = useState(1000);
    const rt = useRichText({
        imageWidth: 120,
    });
    const f = useLanguageFilter();

    render();
    const file = f(await db.fetchExcelFile(identifier));
    render();

    function render() {
        if (!file) {
            show(<LoadingAnimation />);
        } else {
            show(
                <div className="excel-page">
                    {file.sheets.map(renderSheet)}
                </div>
            );
        }
    }

    function renderSheet(sheet, i) {
        return (
            <div key={i}>
                <h2>{sheet.name}</h2>
                <div className="table-container">
                    {renderTable(sheet)}
                </div>
            </div>
        );
    }

    function renderTable(sheet) {
        let columns, rows;
        if (sheet) {
            columns = sheet.columns;
            if (sheet.rows.length > limit) {
                rows = _.slice(sheet.rows, 0, limit);
            } else {
                rows = sheet.rows;
            }
        }
        return (
            <table>
                <thead>
                    <tr>
                        {columns.map(renderHeader)}
                    </tr>
                </thead>
                <tbody>
                    {rows.map(renderRow)}
                </tbody>
            </table>
        );
    }

    function renderHeader(column, i) {
        return (
            <th key={i}>
                {column.name}
            </th>
        );
    }

    function renderRow(row, i) {
        return (
            <tr key={i}>
                {row.cells.map(renderCell)}
            </tr>
        );
    }

    function renderCell(cell, i) {
        return (
            <td key={i}>
                {rt(cell)}
            </td>
        );
    }
}

const component = Relaks.memo(ExcelPage);

export {
    component as default,
};
