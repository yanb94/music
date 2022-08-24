import React from "react";
import { unmountComponentAtNode, render } from "react-dom";
import { jest, expect } from "@jest/globals";
import { act, screen } from "@testing-library/react"
import PageCard from "./PageCard";

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

it("page card render the waited element", () => {

    render(<PageCard className="test" title="Titre de test" desc="Description de texte" buttons={
        <button className="button">button</button>
    } />, container)

    const page = container.querySelector(".test");
    const card = page.querySelector('.test--card');
    const title = card.querySelector('.test--card--title');
    const desc = card.querySelector('.test--card--desc');
    const btnCont = card.querySelector('.test--card--btn-cont')

    const btn = btnCont.querySelector('button.button');

    expect(page).not.toBeNull()
    expect(card).not.toBeNull()

    expect(title).not.toBeNull()
    expect(title.textContent).toBe('Titre de test')

    expect(desc).not.toBeNull()
    expect(desc.textContent).toBe('Description de texte')

    expect(btnCont).not.toBeNull()
    expect(btn).not.toBeNull()

})