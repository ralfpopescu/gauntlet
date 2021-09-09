import { Player as PlayerType } from '../../types-app'
import styled from 'styled-components'

const Container = styled.div`
display: flex;
flex-direction: column;
`

const Event = styled.div`
font-size: 20px;
`

export const Events = ({ events }: { events: string[]}) => {
    return (
        <Container>
            {events.map(event => <Event>{event}</Event>)}
        </Container>
    )
}
