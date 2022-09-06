import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import TextField from '@mui/material/TextField';
import { TimePicker } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DATE_FORMAT, TIME_FORMAT } from '../constant';
import './index.css';

const BookMeeting = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [buildingId, setBuildingId] = useState('');
  const [meetingTitle, setMeetingTitle] = useState('');
  const [startTimeError, setStartTimeError] = useState(null);
  const [endTimeError, setEndTimeError] = useState(null);

  const navigate = useNavigate();
  const { state } = useLocation();
  const { buildingsData } = state;

  const handleBuildingSelect = (e) => {
    setBuildingId(e.target.value);
  };

  const navigateToAvailableRooms = () => {
    console.log('navigate to available rooms');
    navigate('/available-rooms', {
      state: {
        selectedDate: selectedDate?.format(DATE_FORMAT),
        startTime: startTime?.format(TIME_FORMAT),
        endTime: endTime?.format(TIME_FORMAT),
        buildingId,
        meetingTitle,
      }
    });
  }

  const handleTitleChange = e => {
    setMeetingTitle(e.target.value);
  }

  const handleStartTimeValidation = useCallback(() => {
    console.log("🚀 ~ file: index.jsx ~ line 48 ~ handleStartTimeValidation ~ e", startTime)
    
    if(startTime && endTime && startTime.isAfter(endTime)) {
      setStartTimeError(`Start time can't be after end time`);
    }
  }, [endTime, startTime]);


  const handleEndTimeValidation = useCallback(() => {
    console.log("🚀 ~ file: index.jsx ~ line 56 ~ handleEndTimeValidation ~ e", endTime)
    if(startTime && endTime && endTime.isBefore(startTime)) {
      setEndTimeError(`End time can't be before end time`);
    }
  }, [endTime, startTime])

  useEffect(() => {
    handleStartTimeValidation();
  }, [endTimeError, handleStartTimeValidation]);

  useEffect(() => {
    handleEndTimeValidation();
  }, [startTime, handleEndTimeValidation])

  return (
    <div>
      <header className='pageHeader'>
        <span>Add a meeting</span>
      </header>
      <section className='bookingSection'>
        <div className='fieldRow'>
          <DatePicker
            label="Date"
            value={selectedDate}
            onChange={(newValue) => {
              setSelectedDate(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </div>
        <div className='fieldRow'>
          <TimePicker
            label="Start Time"
            value={startTime}
            onChange={(newValue) => {
              setStartTime(newValue);
            }}
            onAccept={handleStartTimeValidation}
            renderInput={(params) => <TextField {...params} />}
          />
          {startTimeError && <div className='errorMessage'>{startTimeError}</div>}
        </div>
        <div className='fieldRow'>
          <TimePicker
            label="End Time"
            value={endTime}
            onChange={(newValue) => {
              setEndTime(newValue);
            }}
            onAccept={handleEndTimeValidation}
            renderInput={(params) => <TextField {...params} />}
          />
        </div>
        {endTimeError && <div className='errorMessage'>{endTimeError}</div>}
        <div className='fieldRow'>
          <FormControl fullWidth>
            <InputLabel id="building-label">Select Building</InputLabel>
            <Select
              labelId="building"
              id="select-building"
              value={buildingId}
              label="Building"
              onChange={handleBuildingSelect}
            >
              {buildingsData.map(({ name, id }) => <MenuItem value={id} key={id}>{name}</MenuItem>)}
            </Select>
          </FormControl>
        </div>
        <div className="fieldRow">
          <TextField id="meeting-title" label="Title" variant="outlined" value={meetingTitle} onChange={handleTitleChange} />
        </div>
        <footer className='bookingFooter'>
          <Button className='nextbtn' variant='contained' onClick={navigateToAvailableRooms}>Next</Button>
        </footer>
      </section>

    </div>
  )
}


export default BookMeeting;