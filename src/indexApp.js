import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { authContext, adalApiFetch } from './adal-config';

class Books extends React.Component {
    constructor() {
        super();
        this.state = {
            books: []
        }
    }

    componentDidMount() {
        adalApiFetch(fetch, "http://localhost:3000/api/books")
            .then(results => results.json())
            .then(results => {
                this.setState({books: results});
            })
    }

    render() {
        return (
            <div>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col" align="left">ID</th>
                            <th scope="col" align="left">Title</th>
                            <th scope="col" align="left">Author</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.books.map(book => {
                        return (
                            <tr key={book.id}>
                                <th scope="row">{book.id}</th>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        );
    }
}


class Page extends React.Component {
    render() {
        const user = authContext.getCachedUser();
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-0 col-lg-2"></div>
                    <div className="col-12 col-lg-8">

                        <div style={{float: 'right'}}>{user.profile.name}<br/><span style={{fontSize: "8px"}}>{user.userName.toLowerCase()}</span></div>
                        <h1 style={{marginBottom: "5px"}}>Library</h1>
                        <Books/>
                    </div>
                    <div className="col-0 col-lg-2"></div>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Page />,
    document.getElementById('root')
);
