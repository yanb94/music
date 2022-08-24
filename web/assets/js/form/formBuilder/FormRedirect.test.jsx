import React from 'react'
import { jest, expect } from "@jest/globals";
import { render } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import 'regenerator-runtime/runtime';
import FormRedirect from './FormRedirect';
import { expectElementHasContent } from '@app/test/util';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from "history";

it("No redirection when isRedirect is undefined", async() => {

    const { container } = render(<FormRedirect redirectTarget="/" >
        Truc
    </FormRedirect>
    )

    expectElementHasContent(container, "Truc")
})

it("No redirection when isRedirect is false", async() => {
    const { container } = render(<FormRedirect isRedirect={false} redirectTarget="/" >
        Truc
    </FormRedirect>
    )

    expectElementHasContent(container, "Truc")
})

it("Redirection when isRedirect is true", async() => {

    const history = createMemoryHistory()

    const { container } = render(
        <Router history={history}>
            <FormRedirect isRedirect={true} redirectTarget="/test" >
                Truc
            </FormRedirect>
        </Router>
    )

    expect(history.location.pathname).toBe("/test");
})