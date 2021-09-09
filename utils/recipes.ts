import { Gear, Player as PlayerType, SetPlayer, Event } from '../types-app'
import { MetaEthos } from './ethos'

export type Recipe = {
    item: Gear;
    requiredMetaEthos: MetaEthos['name'][]
    upgrade: { requiredMetaEthos: MetaEthos['name'][], upgradedItem: Gear}
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
    setPlayer(updatedPlayer)
}

const applyDamageToPlayer = (player: PlayerType, damage: number, setPlayer: SetPlayer): Event => {
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
    return { message: `${player.name} takes ${damage} damage, ${healthDamage} to their health.`, style: { color: 'blue'}}

}

export const reciptes: Recipe[] = [
    {
        item: {
            onPlayerAttack: doNothing,
            onOpponentAttack: doNothing,
            statEffects: (player) => applyGearStatsToPlayer(player, { attack: 1 }),
            name: 'Simple Sword',
            slot: 'mainhand',
        },
        requiredMetaEthos: ['rennti'],
        upgrade: {
            requiredMetaEthos: ['morto'],
            upgradedItem: {
                onPlayerAttack: doNothing,
                onOpponentAttack: doNothing,
                statEffects: (player) => applyGearStatsToPlayer(player, { attack: 3 }),
                name: 'Sharp Sword',
                slot: 'mainhand',
            }
        }
    },
    {
        item: {
            onPlayerAttack: doNothing,
            onOpponentAttack: doNothing,
            statEffects: (player) => applyGearStatsToPlayer(player, { armor: 1 }),
            name: 'Simple Shield',
            slot: 'offhand',
        },
        requiredMetaEthos: ['rennti'],
        upgrade: {
            requiredMetaEthos: ['morto'],
            upgradedItem: {
                onPlayerAttack: doNothing,
                onOpponentAttack: doNothing,
                statEffects: (player) => applyGearStatsToPlayer(player, { attack: 3 }),
                name: 'Sturdy Shield',
                slot: 'offhand',
            }
        }
    },
    {
        item: {
            onPlayerAttack: (player, opponent, setPlayer, setOpponent) => {
                updatePlayerStats(player, { attack: 1 }, setPlayer)
                return { message: `${player.name} attack boosted by 1.`, style: {}}
            },
            onOpponentAttack: (player, opponent, setPlayer, setOpponent) => {
                applyDamageToPlayer(opponent, 1, setOpponent)
                return { message: `${opponent.name} reflected 1 damage back to ${player.name}!`, style: {}}
            },
            statEffects: (player) => applyGearStatsToPlayer(player, { armor: 1, speed: 1 }),
            name: 'Burning Shield',
            slot: 'offhand',
        },
        requiredMetaEthos: ['rennti'],
        upgrade: {
            requiredMetaEthos: ['morto'],
            upgradedItem: {
                onPlayerAttack: (player, opponent, setPlayer, setOpponent) => {
                    updatePlayerStats(player, { attack: 1 }, setPlayer)
                    return { message: `${player.name} attack boosted by 1.`, style: {}}
                },
                onOpponentAttack: (player, opponent, setPlayer, setOpponent) => {
                    applyDamageToPlayer(opponent, 1, setOpponent)
                    return { message: `${opponent.name} reflected 1 damage back to ${player.name}!`, style: {}}
                },
                statEffects: (player) => applyGearStatsToPlayer(player, { armor: 1, speed: 1 }),
                name: 'Sun Shield of Blinding',
                slot: 'offhand',
            }
        }
    }
]