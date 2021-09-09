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

export const recipes: Recipe[] = [
    {
        item: {
            onPlayerAttack: doNothing,
            onOpponentAttack: doNothing,
            statEffects: { attack: 1 },
            name: 'Simple Sword',
            slot: 'mainhand',
            description: 'A simple sword that gets the job done.'
        },
        requiredMetaEthos: ['Eckao'],
        upgrade: {
            requiredMetaEthos: ['Rennti'],
            upgradedItem: {
                onPlayerAttack: doNothing,
                onOpponentAttack: doNothing,
                statEffects: { attack: 3 },
                name: 'Sharp Sword',
                slot: 'mainhand',
                description: 'An iron sword that has been sharpened with a whetstone.'
            }
        }
    },
    {
        item: {
            onPlayerAttack: doNothing,
            onOpponentAttack: doNothing,
            statEffects: { armor: 1 },
            name: 'Simple Shield',
            slot: 'offhand',
            description: 'A small wooden shield of average craftsmanship.'
        },
        requiredMetaEthos: ['Lommam'],
        upgrade: {
            requiredMetaEthos: ['Eckao'],
            upgradedItem: {
                onPlayerAttack: doNothing,
                onOpponentAttack: doNothing,
                statEffects: { attack: 3 },
                name: 'Sturdy Shield',
                slot: 'offhand',
                description: 'A small wooden shield that has been fortified with metal.'
            }
        }
    },
    {
        item: {
            onPlayerAttack: doNothing,
            onOpponentAttack: (player, opponent, setPlayer, setOpponent) => {
                applyDamageToPlayer(opponent, 1, setOpponent)
                return { message: `${opponent.name} reflected 1 damage back to ${player.name}!`, style: {}}
            },
            statEffects: { armor: 1, speed: 1 },
            name: 'Burning Shield',
            slot: 'offhand',
            description: 'A bright shield that is extremely hot to the touch.',
            effectDescription: 'Deals 1 damage to an attacking opponent.',
        },
        requiredMetaEthos: ['Rennti', 'Eckao'],
        upgrade: {
            requiredMetaEthos: ['Lux'],
            upgradedItem: {
                onPlayerAttack: doNothing,
                onOpponentAttack: (player, opponent, setPlayer, setOpponent) => {
                    applyDamageToPlayer(opponent, 2, setOpponent)
                    return { message: `${opponent.name} reflected 1 damage back to ${player.name}!`, style: {}}
                },
                statEffects: { armor: 1, speed: 1 },
                name: 'Sun Shield of Blinding',
                slot: 'offhand',
                description: 'A shield that dazzles all who gaze upon it.',
                effectDescription: 'Deals 2 damage to an attacking opponent and has 20% chance to stun them.',
            }
        }
    },
    {
        item: {
            onPlayerAttack: (player, opponent, setPlayer, setOpponent) => {
                updatePlayerStats(player, { attack: 1 }, setPlayer)
                return { message: `${player.name} attack boosted by 1.`, style: {}}
            },
            onOpponentAttack: doNothing,
            statEffects: { armor: 1, speed: 1 },
            name: 'Blade of Enlightenment',
            slot: 'mainhand',
            description: 'A powerful sword that brings mental clarity to any wielder.',
            effectDescription: 'Boosts attack by 1 each turn.',
        },
        requiredMetaEthos: ['Shii', 'Lommam', 'Eckao'],
        upgrade: {
            requiredMetaEthos: ['Morto'],
            upgradedItem: {
                onPlayerAttack: (player, opponent, setPlayer, setOpponent) => {
                    updatePlayerStats(player, { attack: 1 }, setPlayer)
                    return { message: `${player.name} attack boosted by 1.`, style: {}}
                },
                onOpponentAttack: doNothing,
                statEffects: { armor: 1, speed: 1 },
                name: 'Halcyon',
                slot: 'mainhand',
                description: 'A blade wielded by users who knew too much.',
                effectDescription: 'Boosts attack by 2 every turn.',
            }
        }
    }
]