import React from 'react'

export interface PlayerState {
    player1: Player;
    player2: Player;
}

export type Event = { message: string, style: React.CSSProperties }

export type SetPlayer = (player: Player) => void;

export type Slot = 'mainhand' | 'offhand' | 'chest' | 'head' | 'feet'

export type StatEffects = Partial<{[key in Stats] : number}>;

export interface Gear {
    onPlayerAttack: (
        attackingPlayer: Player, 
        defendingPlayer: Player, 
        setAttackPlayer: SetPlayer,
        setDefendingPlayer: SetPlayer,
        round: number,
        ) => Event | null//message
    onOpponentAttack: (
        attackingPlayer: Player, 
        defendingPlayer: Player, 
        setAttackPlayer: SetPlayer,
        setDefendingPlayer: SetPlayer,
        round: number,
        ) => Event | null
    statEffects: StatEffects
    name: string;
    slot: Slot;
    description: string;
    effectDescription?: string;
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

export type Stats = keyof Omit<Player, 'gear' | 'name'>

