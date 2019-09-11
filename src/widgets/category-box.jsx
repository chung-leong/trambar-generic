import React from 'react';
import Relaks, { useProgress } from 'relaks';
import { useRichText } from 'trambar-www';

import './category-box.scss';

async function CategoryBox(props) {
    const { db, route, ids } = props;
    const { identifier } = route.params;
    const [ show ] = useProgress();
    const rt = useRichText();

    render();
    const categories = await db.fetchWPCategories(identifier, ids);
    render();

    function render() {
        if (!categories || categories.length === 0) {
            show(<div className="category-box hidden"/>);
        } else {
            show(
                <div className="category-box">
                    <h4>{renderTitle()}</h4>
                    <ul>{categories.map(renderCateogry)}</ul>
                </div>
            );
        }
    }

    function renderTitle() {
        return (ids.length === 1) ? 'Category' : 'Categories';
    }

    function renderCateogry(category) {
        const { slug } = category;
        const url = route.find('blog', { identifier, slug });
        const label = rt(category.name);
        return (
            <li className="category">
                <a href={url}>{label}</a>
            </li>
        );
    }
}

const component = Relaks.memo(CategoryBox);

export {
    component as CategoryBox,
};
