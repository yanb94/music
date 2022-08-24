import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { expect } from "@jest/globals";
import TextInput from "@app/form/textInput/TextInput"

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

it("text input render has expected", () => {

    // Mock
    const register = () => {};
    const errors = {};

    render(<TextInput id="lastname" register={register} errors={errors} name="lastname" label="Nom" placeholder="Entrez votre nom"/>, container);

    expect(container.querySelectorAll('.input-text').length).toBe(1);

    const inputContainer = container.querySelector('.input-text')
    const input = inputContainer.querySelector('input')
    const label = inputContainer.querySelector('label')

    expect(input.getAttribute('name')).toBe('lastname');
    expect(input.getAttribute('id')).toBe('lastname');
    expect(input.getAttribute('placeholder')).toBe("Entrez votre nom");
    expect(label.textContent).toBe("Nom")
})

it("text input can have different type", () => {
    // Mock
    const register = () => {};
    const errors = {};

    render(<TextInput id="password" register={register} errors={errors} name="password" label="Password" type="password"/>, container);

    const inputContainer = container.querySelector('.input-text')
    const input = inputContainer.querySelector('input')

    expect(input.getAttribute('type')).toBe('password');
})

it("text input render errors has expected", () => {
    // Mock
    const register = () => {};
    const errors = {"text": {"message": "Vous devez indiquer un texte"}};

    render(<TextInput id="text" register={register} errors={errors} name="text" label="Text"/>, container);

    expect(container.querySelectorAll('.input-text--error').length).toBe(1)

    const error = container.querySelector('.input-text--error')

    expect(error.innerHTML).toBe("<i class=\"fas fa-exclamation-triangle\"></i> Vous devez indiquer un texte")
})