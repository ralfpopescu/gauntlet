import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Player as PlayerType, Gear, Stats, Event, StatsUpdate, Status } from '../../types-app'
import { gearIdsToGear } from '../../utils/recipes'
import { randomName } from '../../utils/default-builds'

export enum PlayerIndex {
    Player,
    Opponent,
}


const defaultPlayer: PlayerType = {
    health: 10,
    attack: 1,
    armor: 1,
    speed: 1,
    accuracy: .95,
    critChance: .05,
    dodgeChance: .05,
    gear: [],
    status: [],
    name: '',
}

type GameState = {
    player: PlayerType,
    opponent: PlayerType,
    round: number,
    turn: PlayerIndex,
    events: Event[],
}

const getInitialState: () => GameState = () => ({
    player: { ...defaultPlayer, name: randomName() },
    opponent: { ...defaultPlayer, name: randomName() },
    round: 0,
    turn: 0,
    events: [],
})


type InitializePlayerInput = { gear?: number[], playerIndex: PlayerIndex, name?: string }

const applyDamageByPlayer = (player: PlayerType, damage: number): PlayerType => {
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

    return { ...player, armor: newArmorValue, health: newHealthValue }
}


const applyGearStatsToPlayer = (player: PlayerType, stats: Partial<{ [key in Stats] : number }>): PlayerType => {
    const statNames: Stats[] = Object.keys(stats) as Stats[]
    const updatedPlayer = { ...player }
    statNames.forEach((statName: Stats) => {
        updatedPlayer[statName] = player[statName] + (stats[statName] || 0)
    })
    return updatedPlayer;
}

const getInitialStats = (player: PlayerType): PlayerType => {
    const { gear: gearIds } = player;
    const gear = gearIdsToGear(gearIds);
    
    let allStatChanges = {}
    let updatedPlayer = { ...player }
    console.log('updatedPlayerupdatedPlayer', updatedPlayer)
    gear.forEach(g => {
        allStatChanges = { ...allStatChanges, ...g.statEffects }
    })
    return applyGearStatsToPlayer(updatedPlayer, allStatChanges);
}

export const updateStatsByPlayer = (player: PlayerType, stats: Partial<{ [key in Stats] : number }>): PlayerType => {
    const statNames: Stats[] = Object.keys(stats) as Stats[]
    const updatedPlayer = { ...player }
    statNames.forEach((statName: Stats) => {
        let newStat = player[statName] + (stats[statName] || 0)
        if (newStat < 0) newStat = 0;

        updatedPlayer[statName] = newStat;
    })
    return updatedPlayer;
}

type UpdatePlayerStatsInput = { stats: StatsUpdate, playerIndex: PlayerIndex }
type UpdatePlayerStatusInput = { status: Status[], playerIndex: PlayerIndex }

const getPlayerByIndex = (state: GameState, index: PlayerIndex) => {
    if(index === PlayerIndex.Player) return state.player;
    return state.opponent;
}

export const appStateSlice = createSlice({
  name: 'appState',
  initialState: getInitialState(),
  reducers: {
    initializePlayer: (state, action: PayloadAction<InitializePlayerInput>) => {
      const { gear, playerIndex, name } = action.payload;
      const playerToAlter = getPlayerByIndex(state, playerIndex)
      const newPlayer = { ...playerToAlter, name: name || 'Player' }

      if(gear) newPlayer.gear = gear;

      const playerWithAppliedStats = getInitialStats(newPlayer)

      if(playerIndex === PlayerIndex.Player) {
        state.player = playerWithAppliedStats;
      } else {
          state.opponent = playerWithAppliedStats;
      }
    },
    initializeTurn: (state) => {
        if(state.player.speed >= state.opponent.speed) {
            state.turn = PlayerIndex.Player;
        } else {
            state.turn = PlayerIndex.Opponent;
        }
    },
    increaseRound: (state) => {
        state.round = state.round + 1;
    },
    switchTurn: (state) => {
        if(state.turn) {
            state.turn = 0;
        } else {
            state.turn = 1;
        }
    },
    updatePlayerStats: (state, action: PayloadAction<UpdatePlayerStatsInput>) => {
        const player = getPlayerByIndex(state, action.payload.playerIndex)
        const updatedPlayer = { ...player, ...updateStatsByPlayer(player, action.payload.stats)};
        console.log('player!!!', player, updatedPlayer)
        if(action.payload.playerIndex === PlayerIndex.Player) {
            state.player = updatedPlayer;
        } else {
            state.opponent = updatedPlayer;
        }
    },
    updatePlayerStatus: (state, action: PayloadAction<UpdatePlayerStatusInput>) => {
        if(action.payload.playerIndex === PlayerIndex.Player) {
            state.player.status = action.payload.status;
        } else {
            state.opponent.status = action.payload.status;
        }
    },
    applyDamageToPlayer: (state, action: PayloadAction<{ playerIndex: PlayerIndex, damage: number}>) => {
        console.log('here')
        const player = getPlayerByIndex(state, action.payload.playerIndex)
        const updatedPlayer = applyDamageByPlayer(player, action.payload.damage);
        console.log('updatedPlayer', updatedPlayer)
        if(action.payload.playerIndex === PlayerIndex.Player) {
            state.player = updatedPlayer;
            const event = { message: `${player.name} took ${action.payload.damage} damage!`, style: {}}
            state.events = [...state.events, event]
        } else {
            state.opponent = updatedPlayer;
            const event = { message: `${state.opponent.name} took ${action.payload.damage} damage!`, style: {}}
            state.events = [...state.events, event]
        }
    },
    recordEvent: (state, action: PayloadAction<Event>) => {
        state.events = [...state.events, action.payload]
    }
  },
})

export const { 
    initializePlayer, 
    initializeTurn, 
    increaseRound, 
    switchTurn, 
    updatePlayerStats, 
    updatePlayerStatus,
    applyDamageToPlayer, 
    recordEvent,
 } = appStateSlice.actions

export default appStateSlice.reducer