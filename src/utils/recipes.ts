import { Gear, Player as PlayerType } from '../types-app'
import { MetaEthos } from './ethos'
import { randomNumber } from './helpers'

const roll = (percentage: number) => {
    const numberToBeLessThan = percentage * 100;
    const rollOutOf100 = randomNumber(0, 100)
    return rollOutOf100 < numberToBeLessThan;
}

export type Recipe = {
    item: Gear;
    requiredMetaEthos: MetaEthos['name'][]
    upgrade: { requiredMetaEthos: MetaEthos['name'][], upgradedItem: Gear}
}

const distributeDamage = (player: PlayerType, damage: number) => {
    const { armor } = player;
    const healthDamage = armor % damage;
    const armorDamage = armor >= damage ? damage : armor;
    return { health: player.health - healthDamage, armor: player.armor - armorDamage }
}

const doNothing = () => null;


export const recipes: Recipe[] = [
    {
        item: {
            id: 1,
            onAttack: doNothing,
            onDefend: doNothing,
            statEffects: { attack: 1 },
            name: 'Simple Sword',
            slot: 'mainhand',
            description: 'A simple sword that gets the job done.'
        },
        requiredMetaEthos: ['Eckao'],
        upgrade: {
            requiredMetaEthos: ['Rennti'],
            upgradedItem: {
                id: 2,
                onAttack: doNothing,
                onDefend: doNothing,
                statEffects: { attack: 3 },
                name: 'Sharp Sword',
                slot: 'mainhand',
                description: 'An iron sword that has been sharpened with a whetstone.'
            }
        }
    },
    {
        item: {
            id: 3,
            onAttack: doNothing,
            onDefend: doNothing,
            statEffects: { armor: 1 },
            name: 'Simple Shield',
            slot: 'offhand',
            description: 'A small wooden shield of average craftsmanship.'
        },
        requiredMetaEthos: ['Lommam'],
        upgrade: {
            requiredMetaEthos: ['Eckao'],
            upgradedItem: {
                id: 4,
                onAttack: doNothing,
                onDefend: doNothing,
                statEffects: { armor: 3 },
                name: 'Sturdy Shield',
                slot: 'offhand',
                description: 'A small wooden shield that has been fortified with metal.'
            }
        }
    },
    {
        item: {
            id: 4000,
            onAttack: doNothing,
            onDefend: ({ attackingPlayer, defendingPlayer }) => {
                const updatedAttackingPlayer = { ...attackingPlayer, ...distributeDamage(attackingPlayer, 1) }
                const events = [{ message: `${defendingPlayer.name} reflected 1 damage back to ${attackingPlayer.name}!`, style: {}}]
                return { events, updatedAttackingPlayer, updatedDefendingPlayer: defendingPlayer }
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
                id: 5,
                onAttack: doNothing,
                onDefend: ({ attackingPlayer, defendingPlayer }) => {
                    const updatedAttackingPlayer = { ...attackingPlayer, ...distributeDamage(attackingPlayer, 2) }
                    const events = [{ message: `${defendingPlayer.name} reflected 2 damage back to ${attackingPlayer.name}!`, style: {}}]
                    return { events, updatedAttackingPlayer, updatedDefendingPlayer: defendingPlayer }
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
            id: 6,
            onAttack: ({ attackingPlayer, defendingPlayer }) => {
                const updatedAttackingPlayer = ({ ...attackingPlayer, attack: attackingPlayer.attack + 1 })
                return { 
                    updatedAttackingPlayer,
                    updatedDefendingPlayer: defendingPlayer,
                    events: [{ message: `${attackingPlayer.name} attack boosted by 1.`, style: {}}]
                }
            },
            onDefend: doNothing,
            statEffects: { attack: 1 },
            name: 'Blade of Enlightenment',
            slot: 'mainhand',
            description: 'A powerful sword that brings mental clarity to any wielder.',
            effectDescription: 'Boosts attack by 1 each turn.',
        },
        requiredMetaEthos: ['Shii', 'Lommam', 'Parlis'],
        upgrade: {
            requiredMetaEthos: ['Morto', 'Morto'],
            upgradedItem: {
                id: 7,
                onAttack: ({ attackingPlayer, defendingPlayer }) => {
                    const updatedAttackingPlayer = ({ ...attackingPlayer, attack: attackingPlayer.attack + 2 })
                    return { 
                        updatedAttackingPlayer,
                        updatedDefendingPlayer: defendingPlayer,
                        events: [{ message: `${attackingPlayer.name} attack boosted by 2.`, style: {}}]
                    }
                },
                onDefend: doNothing,
                statEffects: { attack: 1 },
                name: 'Halcyon',
                slot: 'mainhand',
                description: 'A blade wielded by users who knew too much.',
                effectDescription: 'Boosts attack by 2 every turn.',
            }
        }
    },
    {
        item: {
            id: 8,
            onAttack: ({ attackingPlayer, defendingPlayer, round }) => {
                if(defendingPlayer.armor) {
                    const updatedDefendingPlayer = ({ ...defendingPlayer, armor: 0 })
                    const events = [{ message: `Smashed all of ${defendingPlayer.name}'s armor!`, style: {}}]
                    return { updatedAttackingPlayer: attackingPlayer, updatedDefendingPlayer, events }
                }
                return null;
            },
            onDefend: doNothing,
            statEffects: { attack: -3 },
            name: 'Mountain Hammer',
            slot: 'mainhand',
            description: 'A hammer which makes work of even the tougest armor, but it is very hard to wield.',
            effectDescription: 'Removes all opponent armor on attack.',
        },
        requiredMetaEthos: ['Visyk', 'Eckao'],
        upgrade: {
            requiredMetaEthos: ['Morto'],
            upgradedItem: {
                id: 8,
                onAttack: ({ attackingPlayer, defendingPlayer }) => {
                    if(defendingPlayer.armor) {
                        const updatedDefendingPlayer = ({ ...defendingPlayer, armor: 0 })
                        const events = [{ message: `Smashed all of ${defendingPlayer.name}'s armor!`, style: {}}]
                        return { updatedAttackingPlayer: attackingPlayer, updatedDefendingPlayer, events }
                    }
                    return null;
                },
                onDefend: doNothing,
                statEffects: { armor: 1, speed: 1 },
                name: 'The Heavylight',
                slot: 'mainhand',
                description: 'A massive hammer that is strangely light for its size.',
                effectDescription: 'Removes all opponent armor on attack.',
            }
        }
    },
    {
        item: {
            id: 9,
            onAttack: ({ attackingPlayer, defendingPlayer }) => {
                const shouldHeal = roll(1);
                if(shouldHeal) {
                    //hack to make the players attack not do anything
                    const updatedAttackingPlayerStatus = ([ ...attackingPlayer.status, { turnsLeft: 0, statusEffect: 'debuff' as 'debuff', meta: { attack: 0 - attackingPlayer.attack }}])
                    const updatedDefendingPlayer = ({ 
                        ...defendingPlayer, 
                        health: defendingPlayer.health + attackingPlayer.attack });
                    const updatedAttackingPlayer = {
                        ...attackingPlayer,
                        status: updatedAttackingPlayerStatus,
                    }
                    const events = [{ message: `Oops! The Chaos Wand healed ${defendingPlayer.name} instead of damaging.`, style: { color: 'green' }}]
                    return { events, updatedDefendingPlayer, updatedAttackingPlayer }
                }
                return null;
            },
            onDefend: doNothing,
            statEffects: { attack: 6 },
            name: 'Chaos Wand',
            slot: 'mainhand',
            description: 'A wand with a mind of its own.',
            effectDescription: 'Has a 40% change to heal your opponent instead of damage.',
        },
        requiredMetaEthos: ['Tarcunia', 'Morto'],
        upgrade: {
            requiredMetaEthos: ['Parlis'],
            upgradedItem: {
                id: 10,
                onAttack: ({ attackingPlayer, defendingPlayer }) => {
                    //upgraded has lower chance to heal
                    const shouldHeal = roll(.2);
                    if(shouldHeal) {
                        //hack to make the players attack not do anything
                        const updatedAttackingPlayerStatus = ([ ...attackingPlayer.status, { turnsLeft: 0, statusEffect: 'debuff' as 'debuff', meta: { attack: 0 - attackingPlayer.attack }}])
                        const updatedDefendingPlayer = ({ 
                            ...defendingPlayer, 
                            health: defendingPlayer.health + attackingPlayer.attack });
                        const updatedAttackingPlayer = {
                            ...attackingPlayer,
                            status: updatedAttackingPlayerStatus,
                        }
                        const events = [{ message: `Oops! The Chaos Wand healed ${defendingPlayer.name} instead of damaging.`, style: { color: 'green' }}]
                        return { events, updatedDefendingPlayer, updatedAttackingPlayer }
                    }
                    return null;
                },
                onDefend: doNothing,
                statEffects: { attack: 6, health: 1 },
                name: 'Forgiver',
                slot: 'mainhand',
                description: 'A wand capable of the most horrible and most wonderful things.',
                effectDescription: 'Has a 20% change to heal your opponent instead of damage.',
            }
        }
    },
    {
        item: {
            id: 11,
            onAttack: ({ attackingPlayer, defendingPlayer, round }) => {
                const extraHit = roll(.5);
                if(extraHit && round === 0) {
                    const updatedDefendingPlayer = ({ ...defendingPlayer, health: defendingPlayer.health - attackingPlayer.attack});
                    const events = [{ message: `${attackingPlayer.name} struck an extra time!`, style: { color: 'green' }}]
                    return { updatedAttackingPlayer: attackingPlayer, updatedDefendingPlayer, events }
                }
                return null;
            },
            onDefend: doNothing,
            statEffects: { attack: 3 },
            name: 'Dirty Shiv',
            slot: 'mainhand',
            description: 'The element of surprise is on your side.',
            effectDescription: 'Has a 50% chance to hit an extra time on round 1.',
        },
        requiredMetaEthos: ['Morto'],
        upgrade: {
            requiredMetaEthos: ['Parlis'],
            upgradedItem: {
                id: 12,
                onAttack: ({ attackingPlayer, defendingPlayer }) => {
                    const updatedDefendingPlayer = ({ ...defendingPlayer, health: defendingPlayer.health - attackingPlayer.attack});
                    const events = [{ message: `${attackingPlayer.name} struck an extra time!`, style: { color: 'green' }}]
                    return { updatedAttackingPlayer: attackingPlayer, updatedDefendingPlayer, events }
                },
                onDefend: doNothing,
                statEffects: { attack: 3, speed: 1 },
                name: 'Silent Silver',
                slot: 'mainhand',
                description: 'A wand capable of the most horrible and most wonderful things.',
                effectDescription: 'Hits an extra time on round 1.',
            }
        }
    },
    {
        item: {
            id: 13,
            onAttack: doNothing,
            onDefend: doNothing,
            statEffects: { armor: 3 },
            name: 'Wooden Helmet',
            slot: 'head',
            description: 'A simple helmet carved out of hardwood.',
        },
        requiredMetaEthos: ['Parlis'],
        upgrade: {
            requiredMetaEthos: ['Lux'],
            upgradedItem: {
                id: 14,
                onAttack: doNothing,
                onDefend: doNothing,
                statEffects: { armor: 5, health: 1 },
                name: 'Comfy Wooden Helmet',
                slot: 'head',
                description: 'Someone added a soft, wool interior to a clunky wooden helmet.',
            }
        }
    },
]

export const gearIdsToGear = (gearIds: number[]): Gear[] => gearIds.map(gearId => {
    const recipe = recipes.find(r => r.item.id === gearId || r.upgrade.upgradedItem.id === gearId);
    const item = recipe?.item;
    const upgradedItem = recipe?.upgrade.upgradedItem;

    if(item?.id === gearId) return item;
    return upgradedItem;
}).filter(i => i) as Gear[];
