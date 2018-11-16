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
                console.log(results);
                this.setState({books: results});
            })
            .catch(err => console.log(err))
    }

    render() {
        return (
            <div>
                <table className="book-list">
                    <thead>
                        <tr>
                            <th align="left">ID</th>
                            <th align="left">Title</th>
                            <th align="left">Author</th>
                        </tr>
                    </thead>
                    <tbody>
                    {console.log(this.state.books)}
                    {this.state.books.map(book => {
                        return (
                            <tr key={book.id}>
                                <td>{book.id}</td>
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
            <div>
                <div style={{float: 'right'}}>{user.profile.name}<br/><span style={{fontSize: "8px"}}>{user.userName.toLowerCase()}</span></div>
                <h1 style={{marginBottom: "5px"}}>Library</h1>
                <hr style={{marginTop: "0px"}}/>
                <Books/>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Page />,
    document.getElementById('root')
);
