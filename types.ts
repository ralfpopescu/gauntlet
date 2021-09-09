import React from 'react'

export interface PlayerState {
    player1: Player;
    player2: Player;
}

export interface Gear {
    onPlayerAttack: (attackingPlayer: Player, defendingPlayer: Player) => void
    onOpponentAttack: (attackingPlayer: Player, defendingPlayer: Player) => void
    statEffects: (player: Player) => void
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

