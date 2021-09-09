import { Player as PlayerType } from '../../types-app'
import styled from 'styled-components'

const Container = styled.div`
display: flex;
flex-direction: column;
`

const Stat = styled.div``

const Name = styled.div`
font-size: 20px;
`

export const Player = ({ player }: { player: PlayerType}) => {
    return (
        <Container>
            <Name>{player.name}</Name>
            <Stat>health {player.health}</Stat>
            <Stat>attack {player.attack}</Stat>
            <Stat>armor {player.armor}</Stat>
            <Stat>speed {player.speed}</Stat>
            <Stat>critChance {player.critChance}</Stat>
            <Stat>dodgeChance {player.dodgeChance}</Stat>
            <Stat>missChance {player.missChance}</Stat>
        </Container>
    )
}