import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { expect } from "@jest/globals";
import RadioInput from "@app/form/radioInput/RadioInput"

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

it("radio input render as expected",() => {

    // Mock
    const register = () => {};
    const errors = {};

    render(<RadioInput register={register} errors={errors} label="Sexe" name="sexe" options={{"m":"Homme","f":"Femme"}}/>, container);

    const listRadio = container.querySelectorAll(".radio-input--cont--item");
    const label = container.querySelector(".radio-input > label");

    expect(label.textContent).toBe("Sexe");

    expect(listRadio.length).toBe(2);

    const firstOption = listRadio[0];
    const secondOption = listRadio[1];

    expect(firstOption.children[0].getAttribute("name")).toBe("sexe");
    expect(secondOption.children[0].getAttribute("name")).toBe("sexe");

    expect(firstOption.children[0].getAttribute("id")).toBe("m");
    expect(secondOption.children[0].getAttribute("id")).toBe("f");

    expect(firstOption.children[0].getAttribute("type")).toBe("radio");
    expect(secondOption.children[0].getAttribute("type")).toBe("radio");

    expect(firstOption.children[0].getAttribute("value")).toBe("m");
    expect(secondOption.children[0].getAttribute("value")).toBe("f");

    expect(firstOption.children[1].getAttribute("for")).toBe("m");
    expect(secondOption.children[1].getAttribute("for")).toBe("f");

    expect(firstOption.children[1].textContent).toBe("Homme");
    expect(secondOption.children[1].textContent).toBe("Femme");

})

it("radio input render as expected",() => {
    // Mock
    const register = () => {};
    const errors = {"sexe": {"message": "Vous devez indiquer votre sexe"}};

    render(<RadioInput register={register} errors={errors} label="Sexe" name="sexe" options={{"m":"Homme","f":"Femme"}}/>, container);

    expect(container.querySelectorAll('.radio-input--error').length).toBe(1)
    expect(container.querySelector('.radio-input--error').innerHTML).toBe("<i class=\"fas fa-exclamation-triangle\"></i> Vous devez indiquer votre sexe")
})