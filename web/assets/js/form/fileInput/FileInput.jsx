import React from "react";
import "./FileInput.scss";

export default function FileInput({label, name, register, errors})
{
    return <div className="file-input">
        <label htmlFor={name}>{label}</label>
        <input type="file" {...register(name)} name={name} id={name} />
        {
            errors[name]?.message ? <div className="file-input--error">
                <i className="fas fa-exclamation-triangle"></i> :  {errors[name]?.message}
            </div> : ""
        }
    </div>
}