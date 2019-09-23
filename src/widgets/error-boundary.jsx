import React, { Component } from 'react';

import './error-boundary.scss';

class ErrorBoundary extends Component {
    static displayName = 'ErrorBoundary';

    constructor(props) {
        super(props);
        this.state = { error: null, delinquents: null };
    }

    static getDerivedStateFromProps(props, state) {
        const { children } = props;
        const { delinquents } = state;
        if (delinquents && !compareChildren(children, delinquents)) {
            // clear error upon receiving different children
            return { error: null, delinquents: null };
        }
        return null;
    }

    render() {
        const { children } = this.props;
        const { error } = this.state;
        if (error) {
            let message = '';
            if (error.status) {
                message += error.status + ' ';
            }
            message += error.message;
            let stack;
            if (process.env.NODE_ENV === 'development') {
                stack = <pre>{error.stack}</pre>
            }
            return (
                <div className="error-boundary">
                    {message}
                    {stack}
                </div>
            );
        }
        return children || null;
    }

    componentDidCatch(error, info) {
        const { children } = this.props;
        this.setState({ error, delinquents: children });
    }
}

function compareChildren(c1, c2) {
    if (c1 === c2) {
        return true;
    }
    c1 = React.Children.toArray(c1);
    c2 = React.Children.toArray(c2);
    if (c1.length !== c2.length) {
        return false;
    }
    for (let i = 0; i < c1.length; i++) {
        if (!compareElements(c1[i], c2[i])) {
            return false;
        }
    }
    return true;
}

function compareElements(e1, e2) {
    if (e1.type !== e2.type) {
        return false;
    }
    for (let key in e1.props) {
        if (e1.props[key] !== e2.props[key]) {
            return false;
        }
    }
    for (let key in e2.props) {
        if (!(key in e1.props)) {
            return false;
        }
    }
    return true;
}

export {
    ErrorBoundary,
};
