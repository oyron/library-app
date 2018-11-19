import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { authContext, adalApiFetch } from './adal-config';

class Books extends React.Component {
    constructor() {
        super();
        this.state = {
            books: [],
            errorMessage: null
        }
    }

    componentDidMount() {
        adalApiFetch(fetch, "http://localhost:3000/api/books")
            .then(results => {
                if (results.status !== 200) {
                    console.log("Could not get library data: " + results.statusText);
                    console.log("body: " + JSON.stringify(results.body));
                    this.setState({errorMessage: "Could not read library data. Reason: " + results.statusText});
                    return [];
                }
                return results.json();
            })
            .then(results => {
                this.setState({books: results});
            })
            .catch(error => {
                console.error(error);
            })
    }

    render() {
        return (
            <div>
                <div>{this.state.errorMessage}</div>
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

class AddBook extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            author: "",
            errorMessage: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleChange(event) {
        const change = {};
        change[event.target.id] = event.target.value;
        this.setState(change);
    }

    handleClick() {
        adalApiFetch(fetch, "http://localhost:3000/api/books",
                {
                    method: 'POST',
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({title: this.state.title, author: this.state.author})
                })
            .then(results => {
                if (results.status !== 200) {
                    console.log("Could not save book: " + results.statusText);
                    console.log("body: " + JSON.stringify(results.body));
                    this.setState({errorMessage: "Could not read library data. Reason: " + results.statusText});
                }
            })
            .catch(error => {
                console.error(error);
            })
    }

    render() {
        return (
            <div>
                <form className="form-inline">
                    <label className="sr-only" htmlFor="title">Name</label>
                    <input type="text" className="form-control mb-2 mr-sm-2" id="title" placeholder="Title"
                           value={this.state.title} onChange={this.handleChange}/>


                    <label className="sr-only" htmlFor="author">Name</label>
                    <input type="text" className="form-control mb-2 mr-sm-2" id="author" placeholder="Author"
                           value={this.state.author} onChange={this.handleChange}/>

                    <button type="button" className="btn btn-primary mb-2" onClick={this.handleClick}>Add book</button>
                </form>
            </div>
        )
    }
}


class Page extends React.Component {
    render() {
        const user = authContext.getCachedUser();
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-0 col-lg-2"/>
                    <div className="col-12 col-lg-8">

                        <div style={{float: 'right'}}>{user.profile.name}<br/><span style={{fontSize: "8px"}}>{user.userName.toLowerCase()}</span></div>
                        <h1 style={{marginBottom: "5px"}}>Library</h1>
                        <Books/>
                        <AddBook/>
                    </div>
                    <div className="col-0 col-lg-2"/>
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
