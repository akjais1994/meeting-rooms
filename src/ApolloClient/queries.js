import { gql } from "@apollo/client"

const GET_BUILDINGS = gql`
{
  Buildings {
    name
    id
    meetingRooms {
      id
      name
      floor
      meetings {
        title
        date
        startTime
        endTime
      }
    }
  }
}
`

const GET_MEETING_ROOMS = gql`
{
  MeetingRooms {
    id
    name
    floor
    meetings {
      id
      title
      startTime
      endTime
      date
    }
  }
}
`

const GET_MEETINGS = gql`
{
  Meetings {
    title
    date
    startTime
    endTime
  }
}
`

const BOOK_MEETING = gql`
mutation Meeting(
  $id: Int!,
  $title: String!,
  $date: String!,
  $startTime: String!,
  $endTime: String!,
  $meetingRoomId: Int!,
  ) {
    Meeting(
      id: $id,
      title: $title,
      date: $date,
      startTime: $startTime,
      endTime: $endTime,
      meetingRoomId: $meetingRoomId,
    ) {
      id
      title
    }
  }
`

export {
  GET_BUILDINGS,
  GET_MEETING_ROOMS,
  GET_MEETINGS,
  BOOK_MEETING
}

