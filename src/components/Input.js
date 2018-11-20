import React from "react";

const Input = (props) => {
    return (
        <div className="form-inline">
            <label htmlFor={props.name} className="sr-only">{props.title}</label>
            <input
                className="form-control mb-2 mr-sm-2"
                id={props.name}
                name={props.name}
                type={props.type}
                value={props.value}
                onChange={props.handleChange}
                placeholder={props.placeholder}
            />
        </div>
    )
};

export default Input;