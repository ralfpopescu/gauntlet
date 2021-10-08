import { Gear } from '../../types-app'
import styled from 'styled-components'
import { statEffectsToString } from '../../utils/helpers'

type PlayerGearProps = { gear: Gear[], isHorizontal?: boolean }

const Container = styled.div<{ isHorizontal?: boolean }>`
display: flex;
flex-direction: ${props => props.isHorizontal ? 'row' : 'column'};
padding: 16px;
border: 1px dotted black;
`

type SlotProps = { gear: Gear, name: string }

const Slot = ({ gear, name }: SlotProps) => {
    return (
        <Container>
            <div>{name}</div>
            <div>{gear.name}</div>
            <div>{statEffectsToString(gear.statEffects)}</div>
            {gear.effectDescription && <div>*{gear.effectDescription}*</div>}
        </Container>
    )
}

export const PlayerGear = ({ gear, isHorizontal }: PlayerGearProps) => {
    const head = gear.find(g => g.slot === 'head');
    const mainhand = gear.find(g => g.slot === 'mainhand');
    const offhand = gear.find(g => g.slot === 'offhand');
    const chest = gear.find(g => g.slot === 'chest');
    const feet = gear.find(g => g.slot === 'feet');

    return (
        <Container isHorizontal={isHorizontal}>
            {head && <Slot gear={head} name="Head"/>}
            {mainhand && <Slot gear={mainhand} name="Main-hand"/>}
            {offhand && <Slot gear={offhand} name="Off-hand"/>}
            {chest && <Slot gear={chest} name="Body"/>}
            {feet && <Slot gear={feet} name="Feet"/>}
        </Container>
    )
}