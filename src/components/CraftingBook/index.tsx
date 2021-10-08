import { useState } from 'react'
import styled from "styled-components";
import { recipes } from '../../utils/recipes'
import { Recipe } from './Recipe'

const Container = styled.div`
display: grid;
grid-template-columns: 1fr 1fr 1fr 1fr;
`

const Filters = styled.div`
display: grid;
grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
font-size: 20px;
padding: 20px;
`

const Column = styled.div`
display: flex;
flex-direction: column;
`

const Filter = styled.div`
border: 1px dotted black;
padding: 8px;

cursor: pointer;

&:hover {
    opacity: 0.7;
}
`

export const CraftingBook = () => {
    const [filter, setFilter] = useState<string>('mainhand')
    return (
        <Column>
        <Filters>
                <Filter onClick={() => setFilter('mainhand')}>Main-hand</Filter>
                <Filter onClick={() => setFilter('offhand')}>Off-hand</Filter>
                <Filter onClick={() => setFilter('chest')}>Chest</Filter>
                <Filter onClick={() => setFilter('head')}>Head</Filter>
                <Filter onClick={() => setFilter('feet')}>Feet</Filter>
            </Filters>
        <Container>
            {recipes.filter(recipe => recipe.item.slot === filter).map(recipe => <Recipe recipe={recipe} />)}
        </Container>
        </Column>
    )
}