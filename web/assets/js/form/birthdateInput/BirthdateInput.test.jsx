import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { expect } from "@jest/globals";
import BirthdateInput from "./BirthdateInput";
import { useForm } from "react-hook-form";

function TestForm({errors = {}})
{
    const {control} = useForm();

    return <div>
        <BirthdateInput label="Date de naissance" name="birthday" control={control} errors={errors}/>
    </div>
}

/**
 * @typedef HTMLElement
 */
let container = null;

beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

it("birthday input render has expected", () => {

    render(<TestForm/>,container);

    expect(container.querySelectorAll('.birthdate-input').length).toBe(1);

    const inputCont = container.querySelector('.birthdate-input');
    
    expect(inputCont.querySelectorAll('.birthdate-input--cont').length).toBe(1);

    const fieldCont = inputCont.querySelector('.birthdate-input--cont')

    expect(fieldCont.querySelectorAll('select').length).toBe(3)

    const dayInput = fieldCont.querySelectorAll('select')[0];
    const monthInput = fieldCont.querySelectorAll('select')[1];
    const yearInput = fieldCont.querySelectorAll('select')[2];

    expect(dayInput.getAttribute("id")).toBe("day")
    expect(monthInput.getAttribute("id")).toBe("month")
    expect(yearInput.getAttribute("id")).toBe("year")

    expect(dayInput.querySelectorAll('option').length).toBe(31);
    expect(monthInput.querySelectorAll('option').length).toBe(12);
    expect(yearInput.querySelectorAll('option').length).toBe(80);
})

it("birthday input render errors has expected", () => {
    render(<TestForm errors={{"birthday": {"message": "Vous devez indiquer une date"}}} />,container);

    expect(container.querySelectorAll('.birthdate-input--error').length).toBe(1)
    expect(container.querySelector('.birthdate-input--error').innerHTML).toBe("<i class=\"fas fa-exclamation-triangle\"></i> :  Vous devez indiquer une date")
})