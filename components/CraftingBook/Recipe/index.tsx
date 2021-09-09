import { Recipe as RecipeType } from '../../../utils/recipes'
import styled from 'styled-components'
import { MetaEthos } from '../../MetaEthos'
import { getMetaEthosByName } from '../../../utils/ethos'

const Container = styled.div`
display: flex;
flex-direction: column;
align-items: center;
`

const Name = styled.div`
font-size: 20px;
`

const Description = styled.div`
font-style: italic;
`

const EffectDescription = styled.div`
margin-top: 8px;
margin-bottom: 8px;
`

export const Recipe = ({ recipe }: { recipe: RecipeType}) => {
    return (
        <Container>
            <Name>{recipe.item.name}</Name>
            <Description>{recipe.item.description}</Description>
            <EffectDescription>*{recipe.item.effectDescription || '-'}*</EffectDescription>
            <div>{recipe.requiredMetaEthos.map(ethos => <MetaEthos ethos={getMetaEthosByName(ethos)}/>)}</div>
            
        </Container>
    )
}