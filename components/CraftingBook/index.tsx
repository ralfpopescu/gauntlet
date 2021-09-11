import styled from "styled-components";
import { recipes } from '../../utils/recipes'
import { Recipe } from './Recipe'

const Container = styled.div`
display: grid;
grid-template-columns: 1fr 1fr 1fr 1fr;
`

export const CraftingBook = () => {
    
    return (
        <Container>
            {recipes.map(recipe => <Recipe recipe={recipe} />)}
        </Container>
    )
}