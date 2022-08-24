import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import Button from "./Button"
import { expect } from "@jest/globals";

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

it('Button return the good data depending on its params', () => {

    act(() => {
        render(<Button theme="secondary" height="20px" width="20px" fontSize="20px" style={{'borderTop': '1px solid yellow'}}>Test</Button>,container)
    })

    expect(container.children.length).toBe(1);

    /** @type {HTMLElement}*/
    let buttonHtml = container.children[0];

    expect(buttonHtml.classList.contains("button-secondary")).toBe(true);
    expect(buttonHtml.textContent).toBe("Test");
    expect(buttonHtml.style.height).toBe('20px');
    expect(buttonHtml.style.width).toBe('20px');
    expect(buttonHtml.style.fontSize).toBe('20px');
    expect(buttonHtml.style.borderTop).toBe('1px solid yellow');

    buttonHtml = null;
});