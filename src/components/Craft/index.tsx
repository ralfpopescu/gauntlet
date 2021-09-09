import { useState } from 'react'
import styled from "styled-components";
import { ethos, MetaEthos as MetaEthosType } from '../../utils/ethos'
import { MetaEthos, EmptyMetaEthos} from '../MetaEthos'

const Container = styled.div`
display: grid;
grid-template-rows: 100px 100px 100px 100px;
width: 100%;
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
`

const randomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min);

const rollRandomEthos = (number: number) => new Array(number).fill(null).map(() => randomNumber(0, ethos.length)).map(i => ethos[i])

export const Craft = () => {
    const [chosen, setChosen] = useState<MetaEthosType[]>([])
    const hand = rollRandomEthos(5)
    const choices = rollRandomEthos(10)

    const onMetaEthosClick = (metaEthos: MetaEthosType) => {
        setChosen(c => [...c, metaEthos])
    }

    return (
        <Container>
            <div>Your MetaEthos:</div>
            {console.log(hand)}
            <Hand>
            <EthosContainer>{hand.map(ethos => <MetaEthos ethos={ethos} />)}</EthosContainer>
            <EthosContainer>
                {chosen.map(ethos => <MetaEthos ethos={ethos} />)}
                {hand.map((_, i) => i >= chosen.length && <EmptyMetaEthos />)}
            </EthosContainer>
            </Hand>
            <div>Pick 5 more to add:</div>
            <EthosContainer>{choices.map(ethos => <MetaEthos ethos={ethos} onClick={onMetaEthosClick}/>)}</EthosContainer>
            <button>confirm</button>
        </Container>
    )
}