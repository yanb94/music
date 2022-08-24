import React from "react";
import { unmountComponentAtNode } from "react-dom";
import { jest, expect } from "@jest/globals";
import RegisterConfirmed from "@app/pages/registerConfirmed/RegisterConfirmed";
import { MemoryRouter } from "react-router-dom";
import { render, act, screen } from "@testing-library/react"
import 'regenerator-runtime/runtime'
import '@testing-library/jest-dom/extend-expect'
import processConfirmation from "@app/pages/registerConfirmed/processConfirmation";

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

jest.mock("@app/pages/registerConfirmed/processConfirmation");

it("register confirmed work has expected depending from api response", async () => {

    processConfirmation.mockImplementation(() => Promise.resolve(200))

    const promise = Promise.resolve()

    render(<RegisterConfirmed/>,{wrapper: MemoryRouter},container)

    await act(() => promise)

    expect(screen.getByText("Inscription validée")).toBeInTheDocument()
})

it("register confirmed work has expected when error response from api", async () => {

    processConfirmation.mockImplementation(() => Promise.resolve(404))

    const promise = Promise.resolve()

    render(<RegisterConfirmed/>,{wrapper: MemoryRouter})

    await act(() => promise)

    expect(screen.getByText("Inscription non validée")).toBeInTheDocument()
})
