import React, { useState } from 'react'
import { Recipe as RecipeType } from '../../../utils/recipes'
import styled from 'styled-components'
import { MetaEthos } from '../../MetaEthos'
import { getMetaEthosByName } from '../../../utils/ethos'
import { Stats as StatsType, StatEffects } from '../../../types-app'

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
    missChance: () => <Accuracy style={iconStyle}/>,
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

export const Recipe = ({ recipe }: { recipe: RecipeType}) => {
    const [showUpgrade, setShowUpgrade] = useState<boolean>(false)
    return (
        <Container>
            <Row>
                {console.log(showUpgrade)}
                <button>craft</button>
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