import React from 'react'
import { expect } from "@jest/globals";
import { render } from "@testing-library/react"
import 'regenerator-runtime/runtime'
import { Error, Loading, PartialLoading } from './handlers';
import { expectElementExist } from '@app/test/util';


it("Error component return error when isError is true",async() => {

    const {container} = render(<Error className={'test'} isError={true}>
        Test
    </Error>)

    expectElementExist('.test--error',container)

})

it("Error component return children when isError is false",async() => {
    
    const {container} = render(<Error className={'test'} isError={false}>
        Test
    </Error>)

    expect(container.innerHTML).toBe('Test')
})

it("Loading component return loader when isLoading is true",async() => {

    const {container} = render(<Loading isLoading={true}>
        Test
    </Loading>)

    expectElementExist('.sk-circle',container)
})

it("Loading component return children when isLoading is false",async() => {
    
    const {container} = render(<Loading isLoading={false}>
        Test
    </Loading>)

    expect(container.innerHTML).toBe('Test')
})

it("PartialLoading component return loader when isPartialLoading is true",async() => {

    const {container} = render(<PartialLoading isPartialLoading={true}/>)
    expectElementExist('.sk-circle',container)
})

it("PartialLoading component return nothing when isPartialLoading is false",async() => {
    
    const {container} = render(<PartialLoading isPartialLoading={false}/>)
    expect(container.innerHTML).toBe('')
})