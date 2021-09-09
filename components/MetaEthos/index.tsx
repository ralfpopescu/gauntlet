import React from 'react'
import styled from 'styled-components'
import { MetaEthos as EthosType, Ethos } from '../../utils/ethos'

const ValueContainer = styled.div`
display: grid;
grid-template-columns: repeat(3, 1fr);
grid-template-rows: repeat(3, 1fr);
grid-gap: 12px;
`

const TitleContainer = styled.div`
display: flex;
align-items: center;
margin-bottom: 12px;
cursor: pointer;
width: 100px;

&:hover {
    opacity: 0.7;
}
`

const ValueItemContainer = styled.div`
display: flex;
flex-direction: row;
align-items: center;
`

const ValueItem = ({ name }: { name: string }) => {
    return (
        <ValueItemContainer>*{name}</ValueItemContainer>
    )
}

const EthosName = styled.div``

const EthosColor = styled.div`
background-color: ${props => props.color};
height: 30px;
width: 30px;
border-radius: 50%;
border: 1px solid black;
margin-right: 8px;
`

const EthosEmpty = styled.div`
height: 30px;
width: 30px;
border-radius: 50%;
border: 1px dotted black;
margin-right: 8px;
`

const Container = styled.div`
display: flex;
flex-direction: column;
animation-name: fade-in;
animation-duration: .1s;

@keyframes fade-in {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
`

export const MetaEthos = ({ ethos, onClick }: { ethos: EthosType, onClick?: (ethos: EthosType) => void }) => {
    return (
        <TitleContainer onClick={() => onClick && onClick(ethos)}>
            <EthosColor color={ethos.color}/>
            <EthosName>{ethos.name}</EthosName>
        </TitleContainer>
    )
}


export const EmptyMetaEthos = ({ onClick }: { onClick?: () => void }) => {
    return (
        <TitleContainer onClick={onClick}>
            <EthosEmpty />
            <EthosName>-----</EthosName>
        </TitleContainer>
    )
}

