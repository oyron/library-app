import React from "react";
import DeleteButton from "./DeleteButton";

const BookList = (props) => {
    return (
        <div>
            <table className="table">
                <thead>
                <tr>
                    <th scope="col" align="left">ID</th>
                    <th scope="col" align="left">Title</th>
                    <th scope="col" align="left">Author</th>
                    {props.isAdmin ? (<th/>) : (null) }
                </tr>
                </thead>
                <tbody>
                {props.books.map(book => {
                    return (
                        <tr key={book.id}>
                            <th scope="row">{book.id}</th>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            {props.isAdmin ? (
                                <td><DeleteButton onClick={props.onDelete} id={book.id}/></td>
                            ) : (null) }
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};

export default BookList;
