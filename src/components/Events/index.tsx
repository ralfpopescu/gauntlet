import { Player as PlayerType, Event as EventType } from '../../types-app'
import styled from 'styled-components'

const Container = styled.div`
display: flex;
flex-direction: column;
`

const Event = styled.div`
margin-bottom: 8px;
`

export const Events = ({ events }: { events: EventType[]}) => {
    return (
        <Container>
            {events.map(event => <Event style={event.style}>{event.message}</Event>)}
        </Container>
    )
}
