import React from 'react';
import Relaks, { useProgress } from 'relaks';
import { useRichText } from 'trambar-www';

import './blog-category-box.scss';

async function BlogCategoryBox(props) {
    const { db, route, ids } = props;
    const { identifier } = route.params;
    const [ show ] = useProgress();
    const rt = useRichText();

    render();
    const categories = await db.fetchWPCategories(identifier, ids);
    render();

    function render() {
        if (!categories || categories.length === 0) {
            show(<div className="blog-category-box hidden" />);
        } else {
            show(
                <div className="blog-category-box">
                    <h4>{renderTitle()}</h4>
                    <ul className="categories">
                        {categories.map(renderCategory)}
                    </ul>
                </div>
            );
        }
    }

    function renderTitle() {
        return (ids.length === 1) ? 'Category' : 'Categories';
    }

    function renderCategory(category) {
        const { slug } = category;
        const url = route.find('blog-category', { identifier, slug });
        const label = rt(category.name);
        return (
            <li>
                <a href={url}>{label}</a>
            </li>
        );
    }
}

const component = Relaks.memo(BlogCategoryBox);

export {
    component as BlogCategoryBox,
};
