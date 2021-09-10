import { useState } from 'react'
import styled from "styled-components";
import { ethos, MetaEthos as MetaEthosType } from '../../utils/ethos'
import { Gear } from '../../types-app'
import { MetaEthos, EmptyMetaEthos} from '../MetaEthos'

const Container = styled.div`
display: grid;
grid-template-rows: 100px 100px 100px 100px;
width: 100%;
align-items: center;
justify-content: center;
`

const Hand = styled.div`
display: grid;
grid-template-columns: 1fr 1fr;
width: 100%;
`

const EthosContainer = styled.div`
display: flex;
flex-direction: row;
width: 100%;
align-items: center;
justify-content: center;
`

const Column = styled.div`
display: column;
`

const CraftedGear = ({ gear }: { gear: Gear }) => {
    return (
        <div>{gear.name}</div>
    )
}


type CraftingTableProps = { 
    hand: MetaEthosType[], 
    chosen: MetaEthosType[], 
    choices: MetaEthosType[], 
    onMetaEthosClick: ((metaEthos: MetaEthosType) => void)
    onConfirm: () => void,
    confirmed: boolean,
    craftingTableIngredients: MetaEthosType[], 
    onCraftingTableIngredientClick: ((metaEthos: MetaEthosType) => void),
    clearTable: () => void,
    craftedGear: Gear[]
    confirmedIngredients: MetaEthosType[], 
}

export const CraftingTable = ({ 
    hand, 
    chosen, 
    choices, 
    onMetaEthosClick, 
    onConfirm, 
    confirmed, 
    clearTable,
    craftingTableIngredients,
    onCraftingTableIngredientClick,
    craftedGear,
    confirmedIngredients, 
} : CraftingTableProps) => {
    return (
        <Container>
            {!confirmed ? 
            (<>
            <div>Your MetaEthos:</div>
            {console.log(hand)}
            <Hand>
            <EthosContainer>{hand.map(ethos => <MetaEthos ethos={ethos} />)}</EthosContainer>
            <Column>
            <div>Pick 5 more to add:</div>
            <EthosContainer>{choices.map(ethos => <MetaEthos ethos={ethos} onClick={onMetaEthosClick}/>)}</EthosContainer>
            <EthosContainer>
                {chosen.map(ethos => <MetaEthos ethos={ethos} />)}
                {new Array(10 - (chosen.length + hand.length)).fill(null).map((_, i) => <EmptyMetaEthos />)}
            </EthosContainer>
            </Column>
            </Hand>
            <button onClick={onConfirm}>confirm</button>
            </>)
            :
            (<>
            <div>CRAFTING TABLE</div>
            <EthosContainer>
                {confirmedIngredients.map((ethos) => <MetaEthos ethos={ethos} onClick={onCraftingTableIngredientClick}/>)}
                {new Array(10 - confirmedIngredients.length).fill(null).map((_, i) => <EmptyMetaEthos />)}
            </EthosContainer>
            <EthosContainer>
                {craftingTableIngredients.map((ethos) => <MetaEthos ethos={ethos} />)}
                {new Array(5 - craftingTableIngredients.length).fill(null).map((_, i) => <EmptyMetaEthos />)}
            </EthosContainer>
            {craftedGear.map(gear => <CraftedGear gear={gear}/>)}
            <button onClick={clearTable}>clear</button>
            </>)}
        </Container>
    )
}