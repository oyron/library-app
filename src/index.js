import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Page extends React.Component {
    render() {
        return (
            <div>
                <h1>Library App</h1>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Page />,
    document.getElementById('root')
);
