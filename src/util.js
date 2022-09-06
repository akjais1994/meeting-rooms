const convertStringToDate = (str) => {
  const [day, month, year] = str.split('/');
  return (new Date(+year, month - 1, +day)).toDateString();
}

const convertStrToTime = (date, time) => {
  const [day, month, year] = date.split('/');
  const [hour, min] = time.split(':');
  return (new Date(+year, month - 1, +day, hour, min)).getTime();
}

const isRoomAvailable = (newSlot, meetings) => {
  let isValid = true;

  for (let i = 0; i < meetings.length; i++) {
    if ((
      meetings[i].startTime.isSame(newSlot.endTime)
      || meetings[i].startTime.isBefore(newSlot.endTime)
    )
      && (
        meetings[i].endTime.isSame(newSlot.startTime)
        || meetings[i].endTime.isAfter(newSlot.startTime)
      )) {
      isValid = false;
    }
  }

  return isValid;
}

export {
  convertStrToTime,
  convertStringToDate,
  isRoomAvailable,
}