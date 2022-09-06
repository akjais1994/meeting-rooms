import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Spaces from './Spaces';
import { ApolloProvider } from '@apollo/client';
import { client } from './ApolloClient/client';
import BookMeeting from './BookMeeting';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import AvailableRooms from './AvailableRooms';

function App() {
  return (
    <div>
      <ApolloProvider client={client}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Routes>
            <Route path="/" element={<Spaces />} />
            <Route path="/book-meeting" element={<BookMeeting />} />
            <Route path="/available-rooms" element={<AvailableRooms />} />
          </Routes>
        </LocalizationProvider>
      </ApolloProvider>
    </div>
  );
}

export default App;
