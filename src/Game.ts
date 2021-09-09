import { Player, Gear } from './types'

type Stats = keyof Omit<Player, 'gear' | 'name'>

const applyDamageToPlayer = (player: Player, damage: number) => {
    const { armor, health } = player

    let healthDamage = damage - armor;
    if (healthDamage < 0) healthDamage = 0;

    let newArmorValue = armor;

    if(armor > 0) {
        newArmorValue = armor - damage;
        if (newArmorValue < 0) newArmorValue = 0;
    }

    player.armor = newArmorValue;
    player.health = health - healthDamage;

    console.log(`${player.name} takes ${damage} damage, ${healthDamage} to their health.`)

}

const updatePlayerStats = (player: Player, stats: Partial<{ [key in Stats] : number }>): void => {
    const statNames: Stats[] = Object.keys(stats) as Stats[]
    statNames.forEach((statName: Stats) => {
        player[statName] = player[statName] + (stats[statName] || 0)
    })
}

const sword: Gear = {
    onPlayerAttack: (playerState) => playerState,
    onOpponentAttack: (playerState) => playerState,
    statEffects: (player) => updatePlayerStats(player, { attack: 1 }),
    name: 'sword',
}

const shield: Gear = {
    onPlayerAttack: (playerState) => playerState,
    onOpponentAttack: (playerState) => playerState,
    statEffects: (player) => updatePlayerStats(player, { armor: 1 }),
    name: 'shield',
}

const megaSword: Gear = {
    onPlayerAttack: (playerState) => playerState,
    onOpponentAttack: (playerState) => playerState,
    statEffects: (player) => updatePlayerStats(player, { attack: 3 }),
    name: 'mega sword',
}

const reflector: Gear = {
    onPlayerAttack: (player, opponent) => {
        updatePlayerStats(player, { attack: 1 } )
        console.log('Attack boosted by 1.')
    },
    onOpponentAttack: (player, opponent) => {
        applyDamageToPlayer(opponent, 1)
        console.log('Reflected 1 damage!')
    },
    statEffects: (player) => updatePlayerStats(player, { armor: 1, speed: 1 }),
    name: 'reflector',
}

const defaultPlayer: Omit<Player, 'name'> = {
    health: 10,
    attack: 1,
    armor: 1,
    speed: 1,
    missChance: .05,
    critChance: .05,
    dodgeChance: .05,
    gear: [],
}

type Turn = 0 | 1

const switchTurn = (turn: Turn) => {
    if(turn) return 0
    return 1;
}



const attack = (attackingPlayer: Player, defendingPlayer: Player) => {
    console.log(attackingPlayer.name, ' attacks!')
    const attackerGear = attackingPlayer.gear;
    const defendingGear = defendingPlayer.gear;

    attackerGear.forEach(gear => {
        gear.onPlayerAttack(attackingPlayer, defendingPlayer)
    })

    defendingGear.forEach(gear => {
        gear.onOpponentAttack(attackingPlayer, defendingPlayer)
    })

    const attackingPlayerAttack = attackingPlayer.attack;

    applyDamageToPlayer(defendingPlayer, attackingPlayerAttack)
}

const applyGearStats = (player: Player) => {
    const { gear } = player;
    gear.forEach(g => {
        console.log('GEAR', g)
        g.statEffects(player)
        console.log('AFTER GEAR', player)
    })
}

export const game = () => {
    let player1: Player = { ...defaultPlayer, name: 'Player1' }
    let player2: Player = { ...defaultPlayer, name: 'Player2' }

    player1.gear = [sword, shield]
    player2.gear = [megaSword, reflector]

    applyGearStats(player1)
    applyGearStats(player2)

    console.log('AFTER GEAR!!!')
    console.log(player1, player2)

    let playerTurn: Turn = player1.speed > player2.speed ? 0 : 1
    let roundNumber = 0;


    while(player1.health > 0 && player2.health > 0 && roundNumber < 20) {
        const attackingPlayer = playerTurn ? player1 : player2;
        const defendingPlayer = playerTurn ? player2 : player1;

        attack(attackingPlayer, defendingPlayer)

        playerTurn = switchTurn(playerTurn)
        console.log(roundNumber, player1, player2)
        roundNumber += 1;
    }

    console.log(player1, player2)
    return '1'
}

