import React from "react";
import "./RadioInput.scss";


export default function RadioInput({options,label,name,register,errors})
{
    return <div className="radio-input">
        <label>{label}</label>
        <div className="radio-input--cont">
            {
               Object.keys(options).map((v) => (
                   <div key={v} className="radio-input--cont--item">
                        <input id={v} {...register(name)} type="radio" name={name} value={v}/>
                        <label htmlFor={v}>{options[v]}</label>
                    </div>
                ))
            }
        </div>
        {
            errors[name]?.message ? <div className="radio-input--error">
                <i className="fas fa-exclamation-triangle"></i> {errors[name]?.message}
            </div> : ""
        }
    </div>
}