import { useAppDispatch, useAppSelector } from '../../redux'
import { 
    choose, 
    removeChoice, 
    confirm, 
    putOnCraftingTable, 
    removeFromCraftingTable, 
    craft } from '../../redux/slices/crafting'
import styled from "styled-components";
import { ethos, MetaEthos as MetaEthosType } from '../../utils/ethos'
import { Gear } from '../../types-app'
import { MetaEthos, EmptyMetaEthos} from '../MetaEthos'
import { PlayerGear } from '../PlayerGear'

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

export const CraftingTable = () => {
    const { choices, hand, chosen, craftingTable, metaEthosInventory, playerGear, confirmed } = useAppSelector(state => state.crafting);
    const dispatch = useAppDispatch();

    const addFromChoices = (index: number) => dispatch(choose(index))
    const onMetaEthosInventoryClick = (index: number) => dispatch(putOnCraftingTable(index))
    const onConfirm = () => dispatch(confirm())

    return (
        <Container>
            {!confirmed ? 
            (<>
            <div>Your MetaEthos:</div>
            {console.log(hand)}
            <Hand>
            <EthosContainer>{hand.map((ethos) => <MetaEthos ethos={ethos} />)}</EthosContainer>
            <Column>
            <div>Pick 5 more to add:</div>
            <EthosContainer>{choices.map((ethos, i) => ethos ? 
            <MetaEthos ethos={ethos} onClick={() => addFromChoices(i)}/> 
            : <EmptyMetaEthos />)}</EthosContainer>
            <EthosContainer>
                {chosen.map(ethos => ethos ? <MetaEthos ethos={ethos} /> : <EmptyMetaEthos />)}
            </EthosContainer>
            </Column>
            </Hand>
            <button onClick={onConfirm}>confirm</button>
            </>)
            :
            (<>
            <div>CRAFTING TABLE</div>
            <EthosContainer>
                {metaEthosInventory.map((ethos, i) => ethos ? 
                <MetaEthos ethos={ethos} onClick={() => onMetaEthosInventoryClick(i)}/> 
                : <EmptyMetaEthos />)}
            </EthosContainer>
            <EthosContainer>
                {craftingTable.map(ethos => ethos ? <MetaEthos ethos={ethos} /> : <EmptyMetaEthos />)}
            </EthosContainer>
            <PlayerGear gear={playerGear}/>
            <button>clear</button>
            </>)}
        </Container>
    )
}