import React from "react";

const BookList = (props) => {
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
                {props.books.map(book => {
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
};

export default BookList;
