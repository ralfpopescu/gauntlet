import { useEffect, useState } from "react";
import { Player as PlayerType, Gear } from '../../types-app'
import ReactInterval from "react-interval";
import { Player } from '../Player'
import { Events } from '../Events'
import styled from "styled-components";

const Container = styled.div`
display: flex;
flex-direction: row;
`

const defaultPlayer: Omit<PlayerType, 'name'> = {
    health: 10,
    attack: 1,
    armor: 1,
    speed: 1,
    missChance: .05,
    critChance: .05,
    dodgeChance: .05,
    gear: [],
}

type SetPlayer = (player: PlayerType) => void;

const applyDamageToPlayer = (player: PlayerType, damage: number, setPlayer: SetPlayer): string => {
    const { armor, health } = player

    let healthDamage = damage - armor;
    if (healthDamage < 0) healthDamage = 0;

    let newArmorValue = armor;

    if(armor > 0) {
        newArmorValue = armor - damage;
        if (newArmorValue < 0) newArmorValue = 0;
    }

    player.armor = newArmorValue;
    const newHealthValue = health - healthDamage;

    const newPlayer = { ...player, armor: newArmorValue, health: newHealthValue }

    setPlayer(newPlayer)
    return `${player.name} takes ${damage} damage, ${healthDamage} to their health.`

}


type Turn = 0 | 1

const switchTurn = (turn: Turn) => {
    if(turn) return 0
    return 1;
}

type Stats = keyof Omit<PlayerType, 'gear' | 'name'>

const applyGearStatsToPlayer = (player: PlayerType, stats: Partial<{ [key in Stats] : number }>): PlayerType => {
    const statNames: Stats[] = Object.keys(stats) as Stats[]
    const updatedPlayer = { ...player }
    statNames.forEach((statName: Stats) => {
        updatedPlayer[statName] = player[statName] + (stats[statName] || 0)
    })
    return updatedPlayer;
}

const doNothing = () => null;

const updatePlayerStats = (player: PlayerType, stats: Partial<{ [key in Stats] : number }>, setPlayer: SetPlayer): void => {
    const statNames: Stats[] = Object.keys(stats) as Stats[]
    const updatedPlayer = { ...player }
    statNames.forEach((statName: Stats) => {
        updatedPlayer[statName] = player[statName] + (stats[statName] || 0)
    })
    console.log('updatedplauer!!', updatedPlayer)
    setPlayer(updatedPlayer)
}

const sword: Gear = {
    onPlayerAttack: doNothing,
    onOpponentAttack: doNothing,
    statEffects: (player) => applyGearStatsToPlayer(player, { attack: 1 }),
    name: 'sword',
}

const shield: Gear = {
    onPlayerAttack: doNothing,
    onOpponentAttack: doNothing,
    statEffects: (player) => applyGearStatsToPlayer(player, { armor: 1 }),
    name: 'shield',
}

const megaSword: Gear = {
    onPlayerAttack: doNothing,
    onOpponentAttack: doNothing,
    statEffects: (player) => applyGearStatsToPlayer(player, { attack: 3 }),
    name: 'mega sword',
}

const reflector: Gear = {
    onPlayerAttack: (player, opponent, setPlayer, setOpponent) => {
        updatePlayerStats(player, { attack: 1 }, setPlayer)
        return `${player.name} attack boosted by 1.`
    },
    onOpponentAttack: (player, opponent, setPlayer, setOpponent) => {
        applyDamageToPlayer(opponent, 1, setOpponent)
        return `${opponent.name} reflected 1 damage back to ${player.name}!`
    },
    statEffects: (player) => applyGearStatsToPlayer(player, { armor: 1, speed: 1 }),
    name: 'reflector',
}

const getInitialStats = (player: PlayerType) => {
    const { gear } = player;
    let updatedPlayer = { ...player }
    gear.forEach(g => {
        updatedPlayer = g.statEffects(updatedPlayer)
    })
    return updatedPlayer;
}

export const Game = () => {
    const [player1, setPlayer1] = useState<PlayerType>({ 
        ...getInitialStats({ ...defaultPlayer, gear: [sword, shield], name: 'Player1' }), 
    })
    const [player2, setPlayer2] = useState<PlayerType>({ 
        ...getInitialStats({ ...defaultPlayer, gear: [megaSword, reflector], name: 'Player2' }), 
    })

    const [playerTurn, setPlayerTurn] = useState<Turn>(player1.speed > player2.speed ? 1 : 0)
    const [round, setRound] = useState<number>(0)
    const [events, setEvents] = useState<string[]>([])

    const attack = (
        attackingPlayer: PlayerType, 
        defendingPlayer: PlayerType,
        setAttackingPlayer: SetPlayer,
        setDefendingPlayer: SetPlayer,
        ) => {
        const attackEvent = `${attackingPlayer.name} ' attacks!`
        setEvents(events => [...events, attackEvent])

        const attackerGear = attackingPlayer.gear;
        const defendingGear = defendingPlayer.gear;
    
        attackerGear.forEach(gear => {
            const event = gear.onPlayerAttack(attackingPlayer, defendingPlayer, setAttackingPlayer, setDefendingPlayer)
            if(event) setEvents(events => [...events, event])
        })
    
        defendingGear.forEach(gear => {
            const event = gear.onOpponentAttack(attackingPlayer, defendingPlayer, setAttackingPlayer, setDefendingPlayer)
            if(event) setEvents(events => [...events, event])
        })
    
        const attackingPlayerAttack = attackingPlayer.attack;
    
        const event = applyDamageToPlayer(defendingPlayer, attackingPlayerAttack, setDefendingPlayer)
        if(event) setEvents(events => [...events, event])
    }

    const gameLoop = () => {
        const shouldGameContinue = round < 20 && player1.health > 0 && player2.health > 0

        if(shouldGameContinue) {
            const attackingPlayer = playerTurn ? player1 : player2;
            const defendingPlayer = playerTurn ? player2 : player1;
    
            const setAttackingPlayer = playerTurn ? setPlayer1 : setPlayer2;
            const setDefendingPlayer = playerTurn ? setPlayer2 : setPlayer1;
    
            attack(attackingPlayer, defendingPlayer, setAttackingPlayer, setDefendingPlayer)
    
            setPlayerTurn(switchTurn(playerTurn))
            console.log(round, player1, player2)
            
            setRound(round => (round + 1));
        }
    }


    return (
    <Container>
        <Player player={player1}/>
        <Events events={events}/>
        <Player player={player2}/>
        <ReactInterval timeout={1000} enabled={round < 20 && player1.health > 0 && player2.health > 0}
          callback={gameLoop} />
      </Container>
    )
}