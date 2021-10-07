import { recipes } from './recipes';
import { Gear } from '../types-app'
import { randomNumber } from './helpers'

type Build = number[];

export const opponentNames = [
    'Mighty Grag', 
    'Anthropomorphic Sludge', 
    'Wild Owlman', 
    'Sir Stuven', 
    'Reanimated Viking',
    'Craig the Crazy Craftsman',
    'King of the Meeps',
    'Banished Warrior of Levosh',
    'Capital Guard'
]

export const randomName = () => opponentNames[randomNumber(0, opponentNames.length)];

const getItem = (name: string) => recipes.find(i => i.item.name === name)?.item as Gear;
const getUpgradedItem = (name: string) => recipes.find(i => i.upgrade.upgradedItem.name === name)?.upgrade.upgradedItem as Gear;

const simpleShield = getItem('Simple Shield');
const simpleSword =  getItem('Simple Sword');

const sturdyShield = getUpgradedItem('Sturdy Shield');
const sharpSword = getUpgradedItem('Sharp Sword');

const bladeOfEnlightenment = getItem('Blade of Enlightenment');
const burningShield = getItem('Burning Shield');

export const build1: Build = [simpleShield.id, sharpSword.id];
export const build2: Build = [bladeOfEnlightenment.id, burningShield.id];
export const build3: Build = [sturdyShield.id, simpleSword.id];


