import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { authContext } from './adal-config';

class Footer extends React.Component {
    constructor() {
        super();
        this.state = {
            footerText: "abc"
        }
    }

    componentDidMount() {
        fetch("http://localhost:3000/data")
            .then(results => results.json())
            .then(json => {
                this.setState({footerText: json.data ? json.data : "No data"});
            })
    }

    render() {
        return (
            <div>Server data: {this.state.footerText}</div>
        );
    }
}


class Page extends React.Component {
    render() {
        const user = authContext.getCachedUser();
        return (
            <div>
                <h1>Library App</h1>
                <h3>Info from AD</h3>
                <table>
                    <tbody>
                        <tr>
                            <td>User name:</td>
                            <td>{user.userName}</td>
                        </tr>
                        <tr>
                            <td>Name:</td>
                            <td>{user.profile.name}</td>
                        </tr>
                    </tbody>
                </table>
                <hr/>
                <Footer/>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Page />,
    document.getElementById('root')
);
