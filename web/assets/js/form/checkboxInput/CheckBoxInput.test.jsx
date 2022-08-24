import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { expect } from "@jest/globals";
import CheckBoxInput from "./CheckBoxInput";

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

it("checkbox render as expected", () => {

    // Mock
    const register = () => {};
    const errors = {};

    render(<CheckBoxInput register={register} name="legal" label="J'accepte les conditions générale d'utilisation" errors={errors}/>,container)

    expect(container.children.length).toBe(1);

    expect(container.querySelectorAll("[name='legal']").length).toBe(1);
    expect(container.querySelectorAll("label[for='legal']").length).toBe(1);
    expect(container.querySelector("label[for='legal']").textContent).toBe("J'accepte les conditions générale d'utilisation");
})

it("checkbox render errors as expected", () => {
    // Mock
    const register = () => {};
    const errors = {"legal": {message: "Vous devez coché cette case"}};

    render(<CheckBoxInput register={register} name="legal" label="J'accepte les conditions générale d'utilisation" errors={errors}/>,container)

    expect(container.querySelectorAll('.checkbox-input--error').length).toBe(1)
    expect(container.querySelector('.checkbox-input--error').innerHTML).toBe("<i class=\"fas fa-exclamation-triangle\"></i> :  Vous devez coché cette case")
})