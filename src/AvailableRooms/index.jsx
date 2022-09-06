import { useMutation, useQuery } from '@apollo/client';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BOOK_MEETING, GET_BUILDINGS } from '../ApolloClient/queries';
import { DATE_TIME_FORMAT } from '../constant';
import { isRoomAvailable } from '../util';

import Card from './Card';
import './index.css';

const AvailableRooms = () => {
  const { state } = useLocation();
  const [availableRooms, setAvailableRooms] = useState([]);
  const { data, loading, error } = useQuery(GET_BUILDINGS);
  const [errorState, setErrorState] = useState(false);
  const [bookMeeting] = useMutation(BOOK_MEETING);
  const navigate = useNavigate();

  const { selectedDate, startTime, endTime, buildingId, meetingTitle } = state;

  const findFreeRooms = useCallback(() => {
    const newSlot = {
      startTime: dayjs(`${selectedDate}T${startTime}`, DATE_TIME_FORMAT),
      endTime: dayjs(`${selectedDate}T${endTime}`, DATE_TIME_FORMAT),
    }
    const buildingData = data.Buildings.find((building) => building.id === buildingId);
    const availableMeetingRooms = buildingData.meetingRooms.filter((meetingRoom) => {
      const meetings = meetingRoom.meetings.map(({ date: d, startTime: st, endTime: et, }) => ({
        startTime: dayjs(`${d}T${st}`, DATE_TIME_FORMAT),
        endTime: dayjs(`${d}T${et}`, DATE_TIME_FORMAT),
      }))
      return isRoomAvailable(newSlot, meetings)
    })

    setAvailableRooms(availableMeetingRooms);
    if (availableMeetingRooms.length) {
      setErrorState(false);
    } else {
      setErrorState(true);
    }
  }, [buildingId, data, endTime, selectedDate, startTime]);

  useEffect(() => {
    if (!loading && data && data.Buildings.length > 0) {
      findFreeRooms()
    } else {
      setErrorState(true);
    }
  }, [data, findFreeRooms, loading]);

  const bookRoom = (roomData) => {
    bookMeeting({
      variables: {
        id: Math.floor(Math.random() * 1000),
        title: meetingTitle,
        date: selectedDate,
        startTime: startTime,
        endTime: endTime,
        meetingRoomId: roomData.id,
      },
      onCompleted() {
        navigate('/', {
          state: {
            successMessage: 'Meeting Booked'
          }
        });
      }
    })
  }

  if (error) {
    return (<div>Something went wrong</div>);
  }

  if (errorState) {
    return <div>No Rooms Available</div>
  }

  if (loading)
    return <div>Loading Data</div>

  return (
    <div>
      <header className='pageHeader'>
        <span>Available Rooms</span>
      </header>
      <section className='availableRoomContainer'>
        <div className='title'>Please select one of the below Rooms</div>
        {
          availableRooms.map((roomData, key) =>
            <Card
              buildingName={data.Buildings.find((building) => building.id === buildingId).name}
              meetingRoomData={roomData}
              bookRoom={bookRoom}
              key={key}
            />
          )
        }
      </section>
    </div>
  )
}

export default AvailableRooms;