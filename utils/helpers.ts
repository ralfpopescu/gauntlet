import { ethos } from './ethos'

export const randomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min);

export const rollRandomEthos = (number: number) => new Array(number)
.fill(null).map(() => randomNumber(0, ethos.length)).map(i => ethos[i])

export const roll = (percentage: number) => {
    const numberToBeLessThan = percentage * 100;
    const rollOutOf100 = randomNumber(0, 100)
    return rollOutOf100 < numberToBeLessThan;
}