import { Button } from '@mui/material';
import React from 'react'

const Card = ({ meetingRoomData, buildingName, bookRoom }) => {
  
  const handleRoomBooking = () => {
    bookRoom(meetingRoomData);
  }
  return (
    <div className='cardContainer'>
      <p>
        <b>Building Name :</b> {meetingRoomData.name}
      </p>
      <p>
        <b>Building Name :</b> {buildingName}
      </p>
      <p>
        <b>Floor :</b> {meetingRoomData.floor}
      </p>
      <Button variant='contained' onClick={handleRoomBooking}>Book Room</Button>
    </div>
  )
}

export default Card;