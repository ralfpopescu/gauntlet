import { useAppDispatch, useAppSelector } from '../../redux'
import { 
    increaseRound, 
    switchTurn, 
    updatePlayerStats, 
    applyDamageToPlayer,
    recordEvent, 
    updatePlayerStatus,
    PlayerIndex ,
    updateStatsByPlayer,
} from '../../redux/slices/game'
import { Event, StatsUpdate, Status, Player as PlayerType } from '../../types-app'
import { roll } from '../../utils/helpers'
import ReactInterval from "react-interval";
import { Player } from '../Player'
import { Events } from '../Events'
import { gearIdsToGear } from '../../utils/recipes'
import styled from "styled-components";
import { Stats } from 'fs';

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

const applyBuffsAndDebuffsToPlayer = (player: PlayerType) => {
    const { status } = player;
    console.log('applyBuffsAndDebuffsToPlayer', player, status)
    let updatedPlayer = { ...player }

    status.forEach(status => {
        if(status.statusEffect === 'buff' || status.statusEffect === 'debuff') {
            updatedPlayer = updateStatsByPlayer(updatedPlayer, status.meta)
        }
    })

    return updatedPlayer;
}

const processStatusTurns = (player: PlayerType) => {
    return player.status.filter(status => status.turnsLeft).map(status =>( { ...status, turnsLeft: status.turnsLeft - 1 }));
}

export const Game = () => {
    const round = useAppSelector(state => state.game.round);
    const turn = useAppSelector(state => state.game.turn);
    const events = useAppSelector(state => state.game.events);
    const player = useAppSelector(state => state.game.player);
    const opponent = useAppSelector(state => state.game.opponent);

    const dispatch = useAppDispatch()

    const addEvent = (event: Event) => dispatch(recordEvent(event))
    const setPlayer = (playerIndex: PlayerIndex) => (stats: StatsUpdate) => dispatch(updatePlayerStats({ stats, playerIndex }))
    const setPlayerStatus = (playerIndex: PlayerIndex) => (status: Status[]) => dispatch(updatePlayerStatus({ status, playerIndex }))
    const nextRound = () => dispatch(increaseRound());
    const turnSwitch = () => dispatch(switchTurn());
    const applyDamage = (playerIndex: PlayerIndex, damage: number) => dispatch(applyDamageToPlayer({ playerIndex, damage }))

    const attack = () => {
        //if its turn 0, it's players turn, otherwise enemy
        const defendingPlayerIndex = turn ? 0 : 1;

        const attackingPlayer = turn ? opponent : player;
        const defendingPlayer = turn ? player : opponent;

        const alterPlayerStats = turn ? setPlayer(PlayerIndex.Opponent) : setPlayer(PlayerIndex.Player);
        const alterDefenderStats = turn ? setPlayer(PlayerIndex.Player) : setPlayer(PlayerIndex.Opponent);

        const setAttackerStatus = turn ? setPlayerStatus(PlayerIndex.Opponent) : setPlayerStatus(PlayerIndex.Player);
        const setDefenderStatus = turn ? setPlayerStatus(PlayerIndex.Player) : setPlayerStatus(PlayerIndex.Opponent);

        const attackEvent = { message: `${attackingPlayer.name} attacks!`, style: {color: 'red', marginTop: '8px'} }
        addEvent(attackEvent)
    
        gearIdsToGear(attackingPlayer.gear).forEach(gear => {
            const event = gear.onPlayerAttack(
                attackingPlayer, 
                defendingPlayer, 
                alterPlayerStats, 
                alterDefenderStats, 
                setAttackerStatus,
                setDefenderStatus,
                round,
                )
            if(event) addEvent(event)
        })
    
        gearIdsToGear(defendingPlayer.gear).forEach(gear => {
            const event = gear.onOpponentAttack(
                attackingPlayer, 
                defendingPlayer, 
                alterPlayerStats, 
                alterDefenderStats, 
                setAttackerStatus,
                setDefenderStatus,
                round,
                )
            if(event) addEvent(event)
        })

        const attackingPlayerWithStatus = applyBuffsAndDebuffsToPlayer(attackingPlayer);
        if(!turn) {
            console.log('attackingPlayerWithStatus!!', attackingPlayerWithStatus)
        }
        const defendingPlayerWithStatus = applyBuffsAndDebuffsToPlayer(defendingPlayer);

        const missRoll = !roll(attackingPlayerWithStatus.accuracy);
        const dodgeRoll = roll(defendingPlayerWithStatus.dodgeChance);
        const critRoll = roll(attackingPlayerWithStatus.critChance);

        const newStatus = processStatusTurns(attackingPlayer);
        if(!turn) {
            console.log('newStatus!!', newStatus)
        }
       
        setAttackerStatus(newStatus);

        
        const attackingPlayerAttack = critRoll ? attackingPlayerWithStatus.attack * 2 : attackingPlayerWithStatus.attack;
        if(!missRoll && !dodgeRoll) {
            applyDamage(defendingPlayerIndex, attackingPlayerAttack)
        } else {
            if(missRoll) {
                const missEvent = { message: `${attackingPlayer.name} misses!`, style: {color: 'purple' } }
                addEvent(missEvent)
            } else if (dodgeRoll) {
                const dodgeEvent = { message: `${defendingPlayer.name} dodges!`, style: {color: 'purple' } }
                addEvent(dodgeEvent)
            } else {}
        }
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