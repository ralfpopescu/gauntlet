import styled from "styled-components";
import { ethos } from '../../utils/ethos'
import { MetaEthos } from '../MetaEthos'

const Container = styled.div`
display: grid;
grid-template-rows: 100px 100px 100px 100px;
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
    const hand = rollRandomEthos(5)
    const choices = rollRandomEthos(10)

    return (
        <Container>
            <div>Your MetaEthos:</div>
            {console.log(hand)}
            <EthosContainer>{hand.map(ethos => <MetaEthos ethos={ethos}/>)}</EthosContainer>
            <div>Pick 5 more to add:</div>
            <EthosContainer>{choices.map(ethos => <MetaEthos ethos={ethos}/>)}</EthosContainer>
        </Container>
    )
}