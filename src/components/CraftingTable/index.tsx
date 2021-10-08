import { useAppDispatch, useAppSelector } from '../../redux'
import { 
    choose, 
    removeChoice, 
    confirm, 
    putOnCraftingTable, 
    removeFromCraftingTable, 
    craft } from '../../redux/slices/crafting'
import { initializePlayer, initializeTurn, PlayerIndex } from '../../redux/slices/game'
import { startGame } from '../../redux/slices/app'
import styled from "styled-components";
import { ethos, MetaEthos as MetaEthosType } from '../../utils/ethos'
import { Gear } from '../../types-app'
import { build1, build2, randomName } from '../../utils/default-builds';
import { MetaEthos, EmptyMetaEthos} from '../MetaEthos'
import { PlayerGear } from '../PlayerGear'
import { gearIdsToGear } from '../../utils/recipes';

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
`

const Row = styled.div`
display: flex;
display: row;
`

export const CraftingTable = () => {
    const { choices, hand, chosen, craftingTable, metaEthosInventory, playerGear, confirmed } = useAppSelector(state => state.crafting);
    const dispatch = useAppDispatch();

    const addFromChoices = (index: number) => dispatch(choose(index))
    const onMetaEthosInventoryClick = (index: number) => dispatch(putOnCraftingTable(index))
    const onConfirm = () => dispatch(confirm())
    const onPlay = () => {
        dispatch(initializePlayer({ name: randomName(), playerIndex: PlayerIndex.Player, gear: [...playerGear] }))
        dispatch(initializePlayer({ name: randomName(), playerIndex: PlayerIndex.Opponent, gear: build2 }))
        dispatch(initializeTurn());
        dispatch(startGame())
    }

    return (
        <Container>
            {!confirmed ? 
            (<>
            <div>Your MetaEthos:</div>
            <Hand>
            <EthosContainer>{hand.map((ethos) => <MetaEthos ethos={ethos} />)}</EthosContainer>
            <Column>
            <div>Pick 3 more to add to your inventory:</div>
            <EthosContainer>{choices.map((ethos, i) => ethos ? 
            <MetaEthos ethos={ethos} onClick={() => addFromChoices(i)}/> 
            : <EmptyMetaEthos />)}</EthosContainer>
            <EthosContainer>
                {chosen.map(ethos => ethos ? <MetaEthos ethos={ethos} /> : <EmptyMetaEthos />)}
            </EthosContainer>
            </Column>
            </Hand>
            <div style={{ display: 'block' }}>
            <button onClick={onConfirm}>confirm selection</button>
            </div>
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
            <PlayerGear gear={gearIdsToGear(playerGear)} isHorizontal />
            <Row>
                <button>clear crafting table</button>
                <button onClick={onPlay}>start gauntlet</button>
            </Row>
            </>)}
        </Container>
    )
}