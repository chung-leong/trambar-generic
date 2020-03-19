import React, { useState } from 'react';
import { useProgress, useListener, useRichText } from 'trambar-www';

import { LoadingAnimation } from '../widgets/loading-animation.jsx';
import { ImageDialogBox } from '../widgets/image-dialog-box.jsx';

export async function ExcelContents(props) {
  const { db, route } = props;
  const { identifier } = route.params;
  const [ show ] = useProgress();
  const rt = useRichText({
    imageWidth: 120,
  });
  const [ selectedImage, setSelectedImage ] = useState(null);

  const handleContentsClick = useListener((evt) => {
    const { tagName, src } = evt.target;
    if (tagName === 'IMG') {
      const image = file.image(src);
      if (image) {
        setSelectedImage(image);
      }
    }
  });
  const handleDialogClose = useListener((evt) => {
    setSelectedImage(null);
  });

  render();
  const file = await db.fetchExcelFile(identifier);
  render();

  function render() {
    show(
      <div className="excel-contents" onClick={handleContentsClick}>
        {renderContents()}
        {renderDialogBox()}
      </div>
    );
  }

  function renderContents() {
    if (!file) {
      return <LoadingAnimation />;
    } else {
      const fileLS = file.getLanguageSpecific();
      const { title, description } = fileLS;
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

  function renderDialogBox() {
    const props = {
      show: !!selectedImage,
      image: selectedImage,
      onClose: handleDialogClose,
    };
    return <ImageDialogBox {...props} />;
  }
}
