import { useAppDispatch, useAppSelector } from '../../redux'
import { 
    increaseRound, 
    switchTurn, 
    updatePlayerStats, 
    recordEvent, 
    recordEvents, 
    updatePlayerStatus,
    PlayerIndex ,
    updateStatsByPlayer,
    updatePlayer,
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

const applyDamageToPlayer = (player: PlayerType, damage: number): PlayerType => {
    const { armor, health } = player

    let healthDamage = damage - armor;
    if (healthDamage < 0) healthDamage = 0;

    let newArmorValue = armor;

    if(armor > 0) {
        newArmorValue = armor - damage;
        if (newArmorValue < 0) newArmorValue = 0;
    }

    const newHealthValue = health - healthDamage;

    return { ...player, armor: newArmorValue, health: newHealthValue }
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
    const addEvents = (events: Event[]) => dispatch(recordEvents(events))
    const nextRound = () => dispatch(increaseRound());
    const turnSwitch = () => dispatch(switchTurn());
    const setPlayer = (player: PlayerType, playerIndex: PlayerIndex) =>  dispatch(updatePlayer({ player, playerIndex }));

    const attack = () => {
        //if its turn 0, it's players turn, otherwise enemy
        const defendingPlayerIndex = turn ? 0 : 1;
        const attackingPlayerIndex = turn ? 1 : 0;

        const attackingPlayer = turn ? opponent : player;
        const defendingPlayer = turn ? player : opponent;

        const attackEvent = { message: `${attackingPlayer.name} attacks!`, style: {color: 'red', marginTop: '8px'} }
        addEvent(attackEvent)

        // we will update these as effects happen, and then commit it to the store at the end
        let updatedAttackingPlayer = { ...attackingPlayer }
        let updatedDefendingPlayer = { ...defendingPlayer }

        console.log('0', { updatedDefendingPlayer })
    
        gearIdsToGear(attackingPlayer.gear).forEach(gear => {
            const attackPayload = gear.onAttack({
                attackingPlayer: updatedAttackingPlayer, 
                defendingPlayer: updatedDefendingPlayer, 
                round,
            })
            console.log({ gear, attackPayload, attackingPlayerIndex })

            if (attackPayload?.updatedAttackingPlayer) updatedAttackingPlayer = { ...updatedAttackingPlayer, ...attackPayload.updatedAttackingPlayer }
            if (attackPayload?.updatedDefendingPlayer) updatedDefendingPlayer = { ...updatedDefendingPlayer, ...attackPayload.updatedDefendingPlayer }
            addEvents(attackPayload?.events || [])
        })

        console.log('1', { updatedDefendingPlayer })
    
        gearIdsToGear(defendingPlayer.gear).forEach(gear => {
            const defendPayload = gear.onDefend({
                attackingPlayer: updatedAttackingPlayer, 
                defendingPlayer: updatedDefendingPlayer, 
                round,
            })
            console.log({ gear, defendPayload, attackingPlayerIndex })
            if (defendPayload?.updatedAttackingPlayer) updatedAttackingPlayer = { ...updatedAttackingPlayer, ...defendPayload.updatedAttackingPlayer }
            if (defendPayload?.updatedDefendingPlayer) updatedDefendingPlayer = { ...updatedDefendingPlayer, ...defendPayload.updatedDefendingPlayer }
            addEvents(defendPayload?.events || [])
        })

        console.log('2', { updatedDefendingPlayer })


        //make sure to use "updatedAttackingPlayer" after all the gear effects have happened!
        // these are temporary states that happen because of the buffs/debuffs, but shouldn't get stored
        const attackingPlayerWithStatus = applyBuffsAndDebuffsToPlayer(updatedAttackingPlayer);
        const defendingPlayerWithStatus = applyBuffsAndDebuffsToPlayer(updatedDefendingPlayer);

        console.log('3', { updatedDefendingPlayer: defendingPlayerWithStatus })

        const missRoll = !roll(attackingPlayerWithStatus.accuracy);
        const dodgeRoll = roll(defendingPlayerWithStatus.dodgeChance);
        const critRoll = roll(attackingPlayerWithStatus.critChance);

        // this will reduce the number of turns left on the statuses
        const newStatus = processStatusTurns(updatedAttackingPlayer);
        //update our player with the new statuses
        updatedAttackingPlayer.status = newStatus;

        
        const attackingPlayerAttack = critRoll ? attackingPlayerWithStatus.attack * 2 : attackingPlayerWithStatus.attack;
        if(!missRoll && !dodgeRoll) {
            updatedDefendingPlayer = applyDamageToPlayer(updatedDefendingPlayer, attackingPlayerAttack)
            const hitEvent = { message: `${attackingPlayer.name} hits for ${attackingPlayerAttack} damage.`, style: {color: 'orange' } }
            addEvent(hitEvent)
        } else {
            if(missRoll) {
                const missEvent = { message: `${attackingPlayer.name} misses!`, style: {color: 'purple' } }
                addEvent(missEvent)
            } else if (dodgeRoll) {
                const dodgeEvent = { message: `${defendingPlayer.name} dodges!`, style: {color: 'purple' } }
                addEvent(dodgeEvent)
            } else {}
        }

        console.log('3', { updatedDefendingPlayer })

        setPlayer(updatedAttackingPlayer, attackingPlayerIndex);
        setPlayer(updatedDefendingPlayer, defendingPlayerIndex);
    }

    const gameLoop = () => {
        const shouldGameContinue = round < 20 && player.health > 0 && opponent.health > 0

        if(shouldGameContinue) {
            attack();
            turnSwitch();
            nextRound();
        } else {
            const conclusionEvent = { message: `${player.health <= 0 ? opponent.name : player.name} wins!!`, style: { color: 'purple'}}
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