import React from "react";
import { adalApiFetch } from "../adal-config";
import Input from "./Input";
import BookList from "./BookList";


export default class Books extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAdmin: props.isAdmin,
            newBook: {
                title: "",
                author: ""
            },
            books: [],
            errorMessage: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClickAdd = this.handleClickAdd.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleChange(event) {
        const newBook = this.state.newBook;
        newBook[event.target.name] = event.target.value;
        this.setState({newBook});
    }

    handleDelete(event) {
        this.deleteBook(event.target.id);
    }

    handleClickAdd() {
        this.addBook(this.state.newBook);
    }

    componentDidMount() {
        this.fetchBooks();
    }

    render() {
        return (
            <div>
                <div style={{color: 'red'}}>{this.state.errorMessage}</div>
                <BookList books={this.state.books} onDelete={this.handleDelete} isAdmin={this.state.isAdmin}/>
                    {this.state.isAdmin ? (
                        <form className="form-inline">
                            <Input type={'text'}
                            title= {'Title'}
                            name= {'title'}
                            value={this.state.newBook.title}
                            placeholder = {'Title'}
                            handleChange = {this.handleChange}
                            />

                            <Input type={'text'}
                            title= {'Author'}
                            name= {'author'}
                            value={this.state.newBook.author}
                            placeholder = {'Author'}
                            handleChange = {this.handleChange}
                            />
                            <button type="button" className="btn btn-primary" onClick={this.handleClickAdd}>Add book</button>
                        </form>
                    ) : null
                }
            </div>
        )
    }

    fetchBooks() {
        adalApiFetch(fetch, "http://localhost:3000/api/books")
            .then(results => {
                if (results.status !== 200) {
                    console.error("Could not get library data: " + results.statusText);
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

    addBook(newBook) {
        adalApiFetch(fetch, "http://localhost:3000/api/books",
            {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newBook)
            })
            .then(results => {
                if (results.status !== 201) {
                    let errorMessage = "Could not save book: " + results.statusText;
                    console.error(errorMessage);
                    this.setState({errorMessage});
                }
                else {
                    this.fetchBooks();
                    newBook.author = "";
                    newBook.title = "";
                    this.setState({newBook});
                }
            })
            .catch(error => {
                console.error(error);
                this.setState({error});
            })
    }

    deleteBook(id) {
        adalApiFetch(fetch, `http://localhost:3000/api/books/${id}`,
            {
                method: 'DELETE'
            })
            .then(results => {
                if (results.status !== 204) {
                    console.error("Could not save book: " + results.statusText);
                }
                else {
                    this.fetchBooks();
                }
            })
            .catch(error => {
                console.error(error);
            })
    }
}