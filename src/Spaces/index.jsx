import { useQuery } from '@apollo/client';
import Button from '@mui/material/Button';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GET_BUILDINGS, GET_MEETINGS, GET_MEETING_ROOMS } from '../ApolloClient/queries';
import { convertStringToDate, convertStrToTime } from '../util';
import './index.css';

const Spaces = () => {
  const { state } = useLocation();
  const { data, loading, error } = useQuery(GET_BUILDINGS);
  const { data: meetingsRoomsData, loading: loading1, error: error1 } = useQuery(GET_MEETING_ROOMS);
  const { data: meetingsData, loading: loading2, error: error2 } = useQuery(GET_MEETINGS);

  const todaysDate = (new Date()).toDateString();
  const currentTime = (new Date()).getTime();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState(state?.successMessage);

  const calcMeetingRooms = () => {
    return data.Buildings.reduce((acc, item) => item.meetingRooms.length + acc, 0)
  }

  const calcFreeMeetingRooms = () => {
    let freeRoomsCount = 0;
    meetingsRoomsData.MeetingRooms.forEach((meetingRoom) => {
      const meetingId = meetingRoom.meetings.findIndex((meeting) => {
        return (convertStringToDate(meeting.date) === todaysDate && (
          convertStrToTime(meeting.date, meeting.startTime) <= currentTime &&
          currentTime <= convertStrToTime(meeting.date, meeting.endTime)
        ))
      })

      if (meetingId === -1) {
        freeRoomsCount = freeRoomsCount + 1
      }
    })
    return freeRoomsCount;
  }

  const calcTotalMeetingsToday = () => {
    let count = 0;

    meetingsData.Meetings.forEach(({ date }) => {
      const meetingDate = convertStringToDate(date);
      if (meetingDate === todaysDate) {
        count += 1;
      }
    })

    return count;
  }

  const calcLiveMeetings = () => {
    return meetingsData.Meetings.reduce((acc, meeting) => {
      return acc + +(convertStringToDate(meeting.date) === todaysDate && (
        convertStrToTime(meeting.date, meeting.startTime) <= currentTime &&
        currentTime <= convertStrToTime(meeting.date, meeting.endTime)
      ))
    }, 0)
  }

  const navigateToAddMeeting = () => {
    console.log('navigate to meeting booking');
    const buildingsData = data.Buildings.map(({ name, id }) => ({ name, id }));
    navigate('/book-meeting', {
      state: {
        buildingsData,
      }
    });
  }

  const removeMessage = () => {
    setSuccessMessage(null);
  }

  if (loading || loading1 || loading2)
    return <div className='pageCenter'>Loading Data</div>;

  if (error || error1 || error2)
    return (<div className='pageCenter'>Something went wrong</div>);

  return (
    <div>
      <header className='pageHeader'>
        <span>Dashboard</span>
        <Button variant='contained' onClick={navigateToAddMeeting}>Add a Meeting</Button>
      </header>
      {
        successMessage ?
          (<div className='successMessage'>
            <span>{successMessage} </span>
            <span onClick={removeMessage}>x</span>
          </div>) : null
      }
      <section className='section'>
        <header className='sectionHeader'>Buildings</header>
        <div className='sectionBody'>Total: {data.Buildings.length}</div>
      </section>
      <section className='section'>
        <header className='sectionHeader'>Meeting Rooms</header>
        <div className='sectionBody'>
          <div>
            Total: {calcMeetingRooms()}
          </div>
          <span>
            Free Now: {calcFreeMeetingRooms()}
          </span>
        </div>
      </section>
      <section className='section'>
        <header className='sectionHeader'>Meetings</header>
        <div className='sectionBody'>
          <div>Total: {calcTotalMeetingsToday()} today</div>
          <div>Total {calcLiveMeetings()} going on now</div>
        </div>
      </section>
    </div>
  )
}


export default Spaces;