import React from 'react'

export interface PlayerState {
    player1: Player;
    player2: Player;
}

type SetPlayer = (player: Player) => void;

export interface Gear {
    onPlayerAttack: (
        attackingPlayer: Player, 
        defendingPlayer: Player, 
        setAttackPlayer: SetPlayer,
        setDefendingPlayer: SetPlayer,
        ) => void
    onOpponentAttack: (
        attackingPlayer: Player, 
        defendingPlayer: Player, 
        setAttackPlayer: SetPlayer,
        setDefendingPlayer: SetPlayer,
        ) => void
    statEffects: (player: Player) => Player
    name: string;
}

export interface Player {
    name: string;
    health: number;
    attack: number;
    armor: number;
    speed: number;
    critChance: number;
    missChance: number;
    dodgeChance: number;
    gear: Gear[]
}

