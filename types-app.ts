import React from 'react'

export interface PlayerState {
    player1: Player;
    player2: Player;
}
export type Stats = keyof Omit<Player, 'gear' | 'name' | 'status'>


export type Event = { message: string, style: React.CSSProperties }

export type StatEffects = Partial<{[key in Stats] : number}>;

export type SetPlayer = (player: Player) => void;

export type SetPlayerStatus = (status: Status[]) => void;

export type AlterPlayerStats = (stats: StatEffects) => void;

export type StatsUpdate = Partial<{ [key in Stats] : number }>

export type Slot = 'mainhand' | 'offhand' | 'chest' | 'head' | 'feet'

export type Ethos = 'Tarcunia' | 'Visyk' | 'Rennti' | 'Morto' | 'Shii' | 'Parlis' | 'Lommam' | 'Eckao' | 'Lux'

export type StatusEffect = 'buff' | 'debuff' | 'poison' | 'stunned'

export type BuffMeta = StatEffects;

export type SeverityMeta = { severity: number };

export type Status = { turnsLeft: number, statusEffect: 'buff', meta: BuffMeta } |
{ turnsLeft: number, statusEffect: 'debuff', meta: BuffMeta } | 
{ turnsLeft: number, statusEffect: 'poison', meta: SeverityMeta } | 
{ turnsLeft: number, statusEffect: 'stunned' }


export type MetaEthos = { name: Ethos, values: string[], color: string }

export type Recipe = {
    item: Gear;
    requiredMetaEthos: MetaEthos['name'][]
    upgrade: { requiredMetaEthos: MetaEthos['name'][], upgradedItem: Gear}
}


export interface Gear {
    onPlayerAttack: (
        attackingPlayer: Player, 
        defendingPlayer: Player, 
        alterPlayerStats: AlterPlayerStats,
        alterDefenderStats: AlterPlayerStats,
        setPlayerStatus: SetPlayerStatus,
        setDefenderStatus: SetPlayerStatus,
        round: number,
        ) => Event | null//message
    onOpponentAttack: (
        attackingPlayer: Player, 
        defendingPlayer: Player, 
        alterPlayerStats: AlterPlayerStats,
        alterDefenderStats: AlterPlayerStats,
        setPlayerStatus: SetPlayerStatus,
        setDefenderStatus: SetPlayerStatus,
        round: number,
        ) => Event | null
    statEffects: StatEffects
    name: string;
    slot: Slot;
    description: string;
    effectDescription?: string;
    id: number,
}

export interface Player {
    name: string;
    health: number;
    attack: number;
    armor: number;
    speed: number;
    critChance: number;
    accuracy: number;
    dodgeChance: number;
    gear: number[],
    status: Status[],
}


