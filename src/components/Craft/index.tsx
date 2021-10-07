import { useState } from 'react'
import styled from "styled-components";
import { ethos, MetaEthos as MetaEthosType } from '../../utils/ethos'
import { Gear } from '../../types-app'
import { CraftingTable } from '../CraftingTable'
import { CraftingBook } from '../CraftingBook'

const Container = styled.div`
display: grid;
`

export const Craft = () => {
    return (
        <Container>
            <CraftingTable />
            <CraftingBook />
        </Container>
    )
}