import React, { useState } from 'react';
import Relaks, { useProgress } from 'relaks';
import { useRichText, useLanguageFilter } from 'trambar-www';

import { LoadingAnimation } from '../widgets/loading-animation.jsx';

async function ExcelContents(props) {
    const { db, route } = props;
    const { identifier } = route.params;
    const [ show ] = useProgress();
    const rt = useRichText({
        imageWidth: 120,
    });
    const f = useLanguageFilter();

    render();
    const file = f(await db.fetchExcelFile(identifier));
    render();

    function render() {
        show(
            <div className="excel-contents">
                {renderContents()}
            </div>
        );
    }

    function renderContents() {
        if (!file) {
            return <LoadingAnimation />;
        } else {
            const { title, description } = file;
            return (
                <React.Fragment>
                    <h1>{title}</h1>
                    <p>{description}</p>
                    {file.sheets.map(renderSheet)}
                </React.Fragment>
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
        const { columns, rows } = sheet;
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

const component = Relaks.memo(ExcelContents);

export {
    component as ExcelContents,
};
