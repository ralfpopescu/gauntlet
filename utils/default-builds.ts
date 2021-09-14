import { recipes } from './recipes';
import { Gear } from '../types-app'

type Build = number[];

const simpleShield = recipes.find(i => i.item.name === 'Simple Shield')?.item as Gear;
const simpleSword = recipes.find(i => i.item.name === 'Simple Sword')?.item as Gear;

const sturdyShield = recipes.find(i => i.item.name === 'Simple Shield')?.upgrade.upgradedItem as Gear;
const sharpSword = recipes.find(i => i.item.name === 'Simple Sword')?.upgrade.upgradedItem as Gear;

export const build1: Build = [simpleShield.id, sharpSword.id];
export const build2: Build = [sturdyShield.id, simpleSword.id];


