import React, { useState } from 'react'
import { Recipe as RecipeType } from '../../../utils/recipes'
import styled from 'styled-components'
import { MetaEthos } from '../../MetaEthos'
import { getMetaEthosByName } from '../../../utils/ethos'
import { Stats as StatsType, StatEffects, Gear } from '../../../types-app'
import { ethos, MetaEthos as MetaEthosType } from '../../../utils/ethos'
import { useAppDispatch, useAppSelector } from '../../../redux'
import { craft } from '../../../redux/slices/crafting'

import { ReactComponent as Health } from '../../../assets/heart.svg'
import { ReactComponent as Speed } from '../../../assets/hermes.svg'
import { ReactComponent as Armor } from '../../../assets/shield.svg'
import { ReactComponent as Attack } from '../../../assets/sword.svg'
import { ReactComponent as Crit } from '../../../assets/explosion.svg'
import { ReactComponent as Accuracy } from '../../../assets/darts.svg'

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

const Row = styled.div`
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
`

type IconMap = { [key in StatsType]: React.ElementType }

const iconStyle = {
    height: '20px',
    width: '20px',
    marginRight: '8px',
    marginLeft: '8px',
}


const getIconFromStatName: IconMap = {
    health: () => <Health style={iconStyle}/>,
    speed: () => <Speed style={iconStyle}/>,
    armor: () => <Armor style={iconStyle}/>,
    attack: () => <Attack style={iconStyle}/>,
    critChance: () => <Crit style={iconStyle}/>,
    accuracy: () => <Accuracy style={iconStyle}/>,
    dodgeChance: () => <Speed style={iconStyle}/>,

}


const Stats = ({ stats }: { stats: StatEffects }) => {
    const statNames = Object.keys(stats) as Array<keyof StatsType>;
    return (
        <Row>
            {/* @ts-ignore */}
            {statNames.map((statName) => <Row>{getIconFromStatName[statName]()} {stats[statName]}</Row>)}
        </Row>
    )
}

const meetsRequirements = (recipe: RecipeType, ingredients: Array<MetaEthosType | null>, upgrade: boolean) => {
    const ingredientNames = ingredients.filter(i => i).map(i => i ? i.name : null);
    const required = upgrade ? recipe.upgrade.requiredMetaEthos : recipe.requiredMetaEthos;
    return required
    .map(metaEthos => ingredientNames.includes(metaEthos))
    .reduce((acc, curr) => acc && curr)
}

type RecipeProps = { 
    recipe: RecipeType, 
    craftingTableIngredients?: MetaEthosType[] 
}

export const Recipe = ({ recipe }: RecipeProps) => {
    const [showUpgrade, setShowUpgrade] = useState<boolean>(false)
    const { craftingTable } = useAppSelector(state => state.crafting);
    const meetRequirements = meetsRequirements(recipe, craftingTable, showUpgrade)
    const dispatch = useAppDispatch();

    const onCraft = () => dispatch(craft({ recipe, upgrade: showUpgrade }))

    return (
        <Container>
            <Row>
                {console.log(showUpgrade)}
                <button disabled={!meetRequirements} onClick={() => meetRequirements ? onCraft() : null}>craft</button>
                <Name>{showUpgrade ? recipe.upgrade.upgradedItem.name : recipe.item.name}</Name>
                <button onClick={() => setShowUpgrade(value => !value)}>{showUpgrade ? 'downgrade' : 'upgrade'}</button>
            </Row>
            <Stats stats={showUpgrade ? recipe.upgrade.upgradedItem.statEffects : recipe.item.statEffects} />
            <Description>{showUpgrade ? recipe.upgrade.upgradedItem.description : recipe.item.description}</Description>
            <EffectDescription>*{showUpgrade ? recipe.upgrade.upgradedItem.effectDescription : recipe.item.effectDescription || '-'}*</EffectDescription>
            <div>{recipe.requiredMetaEthos.map(ethos => <MetaEthos ethos={getMetaEthosByName(ethos)}/>)}</div>
            <div>{showUpgrade && <div> + {recipe.upgrade.requiredMetaEthos.map(ethos => <MetaEthos ethos={getMetaEthosByName(ethos)}/>)}</div>}</div>
            
            
        </Container>
    )
}