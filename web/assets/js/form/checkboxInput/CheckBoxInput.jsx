import React from "react";
import "./CheckBoxInput.scss";

export default function CheckBoxInput({label, name, register, errors})
{
    return <div className="checkbox-input">
        <input type="checkbox" {...register(name)} name={name} id={name} />
        <label htmlFor={name}>{label}</label>
        {
            errors[name]?.message ? <div className="checkbox-input--error">
                <i className="fas fa-exclamation-triangle"></i> :  {errors[name]?.message}
            </div> : ""
        }
    </div>
}