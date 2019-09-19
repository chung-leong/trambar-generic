import React, { useState, useRef, useCallback } from 'react';

function SearchBox(props) {
    const { route } = props;
    const [ search, setSearch ] = useState(() => {
        if (route.name === 'search') {
            return route.params.search;
        }
        return '';
    });
    const link = useRef();

    const handleSearchChange = useCallback((evt) => {
        const text = evt.target.value;
        setSearch(text);
    });
    const handleKeyDown = useCallback((evt) => {
        if (evt.keyCode === 13) {
            link.current.click();
        }
    });

    const url = route.find('search', { search });
    return (
        <div className="search-box">
            <input value={search} onChange={handleSearchChange} onKeyDown={handleKeyDown}/>
            <a href={url} ref={link}>
                <span className="magnifying-class">&#9906;</span>
            </a>
        </div>
    );
}

export {
    SearchBox,
};
