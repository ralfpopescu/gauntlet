import { useAppDispatch, useAppSelector } from '../../redux'
import { 
    increaseRound, 
    switchTurn, 
    updatePlayerStats, 
    applyDamageToPlayer,
    recordEvent, 
    PlayerIndex 
} from '../../redux/slices/game'
import { Event, StatsUpdate } from '../../types-app'
import ReactInterval from "react-interval";
import { Player } from '../Player'
import { Events } from '../Events'
import { gearIdsToGear } from '../../utils/recipes'
import styled from "styled-components";

const Container = styled.div`
display: grid;
grid-template-columns: 1fr 1fr 1fr;
grid-template-rows: 100px 1fr;

grid-template-areas: 'header header header' 'player1 events player2'
`

const GridArea = styled.div<{ name: string }>`
grid-area: ${props => props.name};
`

const Header = styled.div`
text-align: center;
font-size: 32px;
`

export const Game = () => {
    const round = useAppSelector(state => state.game.round);
    const turn = useAppSelector(state => state.game.turn);
    const events = useAppSelector(state => state.game.events);
    const player = useAppSelector(state => state.game.player);
    const opponent = useAppSelector(state => state.game.opponent);

    const dispatch = useAppDispatch()

    const addEvent = (event: Event) => dispatch(recordEvent(event))
    const setPlayer = (playerIndex: PlayerIndex) => (stats: StatsUpdate) => dispatch(updatePlayerStats({ stats, playerIndex }))
    const nextRound = () => dispatch(increaseRound());
    const turnSwitch = () => dispatch(switchTurn());
    const applyDamage = (playerIndex: PlayerIndex, damage: number) => dispatch(applyDamageToPlayer({ playerIndex, damage }))

    const attack = () => {
        //if its turn 0, it's players turn, otherwise enemy
        const defendingPlayerIndex = turn ? 0 : 1;

        const attackingPlayer = turn ? opponent : player;
        const defendingPlayer = turn ? player : opponent;
        const setAttackingPlayer = turn ? setPlayer(PlayerIndex.Player) : setPlayer(PlayerIndex.Opponent);
        const setDefendingPlayer = turn ? setPlayer(PlayerIndex.Opponent) : setPlayer(PlayerIndex.Player);

        const attackEvent = { message: `${attackingPlayer.name} attacks!`, style: {color: 'red', marginTop: '8px'} }
        addEvent(attackEvent)
    
        gearIdsToGear(attackingPlayer.gear).forEach(gear => {
            const event = gear.onPlayerAttack(attackingPlayer, defendingPlayer, setAttackingPlayer, setDefendingPlayer, round)
            if(event) addEvent(event)
        })
    
        gearIdsToGear(defendingPlayer.gear).forEach(gear => {
            const event = gear.onOpponentAttack(attackingPlayer, defendingPlayer, setAttackingPlayer, setDefendingPlayer, round)
            if(event) addEvent(event)
        })
    
        const attackingPlayerAttack = attackingPlayer.attack;
        applyDamage(defendingPlayerIndex, attackingPlayerAttack)
    }

    const gameLoop = () => {
        const shouldGameContinue = round < 20 && player.health > 0 && opponent.health > 0

        if(shouldGameContinue) {
            attack();
            turnSwitch();
            nextRound();
        } else {
            const conclusionEvent = { message: `${player.health < 0 ? opponent.name : player.name} wins!!`, style: { color: 'purple'}}
            if(!events.find(event => event.message === conclusionEvent.message)) addEvent(conclusionEvent)
        }
    }


    return (
    <Container>

        <GridArea name="header">
            <Header>
                GAUNTLET
            </Header>
        </GridArea>

        <GridArea name="player1">
            <Player player={player}/>
        </GridArea>

        <GridArea name="events">
            <Events events={events}/>
        </GridArea>

        <GridArea name="player2">
         <Player player={opponent}/>
        </GridArea>

        <ReactInterval timeout={1000} enabled={round < 20 && player.health > 0 && opponent.health > 0}
          callback={gameLoop} />

      </Container>
    )
}