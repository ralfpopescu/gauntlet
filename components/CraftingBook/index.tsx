import styled from "styled-components";
import { recipes } from '../../utils/recipes'
import { Recipe } from './Recipe'
import { ethos, MetaEthos as MetaEthosType } from '../../utils/ethos'
import { Gear } from '../../types-app'

const Container = styled.div`
display: grid;
grid-template-columns: 1fr 1fr 1fr 1fr;
`

type CraftingBookProps = { craftingTableIngredients?: MetaEthosType[], onCraft: (gear: Gear) => void }

export const CraftingBook = ({ craftingTableIngredients = [], onCraft }: CraftingBookProps) => {
    
    return (
        <Container>
            {recipes.map(recipe => <Recipe 
            recipe={recipe} 
            craftingTableIngredients={craftingTableIngredients} 
            onCraft={onCraft}
            />)}
        </Container>
    )
}