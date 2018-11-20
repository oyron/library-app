import React from "react";

const DeleteButton = (props) => {
    return (
        <button type="button" className="btn btn-primary btn-sm" onClick={props.onClick} id={props.id}>Delete</button>
    )
};

export default DeleteButton;