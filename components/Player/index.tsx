import { Player as PlayerType } from '../../types-app'
import styled from 'styled-components'
import { ReactComponent as Health } from '../../assets/heart.svg'
import { ReactComponent as Speed } from '../../assets/hermes.svg'
import { ReactComponent as Armor } from '../../assets/shield.svg'
import { ReactComponent as Attack } from '../../assets/sword.svg'
import { ReactComponent as Crit } from '../../assets/explosion.svg'
import { ReactComponent as Accuracy } from '../../assets/darts.svg'
import { PlayerGear } from '../PlayerGear'
import { gearIdsToGear  } from '../../utils/recipes'

const Container = styled.div`
display: flex;
flex-direction: column;
`

const Stat = styled.div`
display: flex;
flex-direction: row;
justify-content: center;
font-size: 20px;
animation: pop .2s ease-in-out;

@keyframes pop {
    0% { transform: scale(1); }
    100% { transform: scale(1.2); }
    0% { transform: scale(1); }
    }
`

const Name = styled.div`
font-size: 32px;
`

const iconStyle = {
    height: '20px',
    width: '20px',
    marginRight: '8px',
}

export const Player = ({ player }: { player: PlayerType}) => {
    return (
        <Container>
            <Name>{player.name}</Name>
            <Stat key={`health-${player.health}`}>
                <Health style={iconStyle}/> health {player.health}
            </Stat>
            <Stat key={`attack-${player.attack}`}>
                <Attack style={iconStyle}/> attack {player.attack}
            </Stat>
            <Stat key={`armor-${player.armor}`}>
                <Armor style={iconStyle}/> armor {player.armor}
            </Stat>
            <Stat key={`speed-${player.speed}`}>
                <Speed style={iconStyle}/> speed {player.speed}
            </Stat>
            <Stat key={`crit-${player.critChance}`}>
                <Crit style={iconStyle}/>critChance {player.critChance}
            </Stat>
            <Stat key={`dodge-${player.dodgeChance}`}>
                <Speed style={iconStyle}/>dodgeChance {player.dodgeChance}
            </Stat>
            <Stat key={`accuracy-${player.accuracy}`}>
                <Accuracy style={iconStyle}/> missChance {player.accuracy}
            </Stat>
            <PlayerGear gear={gearIdsToGear(player.gear)}/>
        </Container>
    )
}