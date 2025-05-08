import React, { useState } from 'react';
import dayjs from 'dayjs';
import './App.css';

const App = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [events, setEvents] = useState([
    { id: 1, date: '2025-05-08', title: 'Meeting with team', time: '14:00', duration: '1h' },
    { id: 2, date: '2025-05-08', title: 'Doctor Appointment', time: '14:30', duration: '30m' },
    { id: 3, date: '2025-05-09', title: 'Birthday Party', time: '18:00', duration: '3h' }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ id: null, title: '', date: '', time: '', duration: '' });
  const [editMode, setEditMode] = useState(false);

  const startDay = currentDate.startOf('month').startOf('week');
  const endDay = currentDate.endOf('month').endOf('week');
  const daysArray = [];
  let day = startDay;

  while (day.isBefore(endDay) || day.isSame(endDay, 'day')) {
    daysArray.push(day.clone());
    day = day.add(1, 'day');
  }

  const goToPrevMonth = () => setCurrentDate(currentDate.subtract(1, 'month'));
  const goToNextMonth = () => setCurrentDate(currentDate.add(1, 'month'));
  const isToday = (day) => day.format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD');
  const getEventsForDate = (date) => {
    const formatted = date.format('YYYY-MM-DD');
    return events.filter((event) => event.date === formatted);
  };

  const handleInputChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const addEvent = (e) => {
    e.preventDefault();
    const formattedDate = dayjs(newEvent.date).format('YYYY-MM-DD');

    if (editMode) {
      // Edit existing event
      setEvents(events.map(ev =>
        ev.id === newEvent.id ? { ...newEvent, date: formattedDate } : ev
      ));
    } else {
      // Add new event
      const id = Date.now();
      setEvents([...events, { ...newEvent, id, date: formattedDate }]);
    }

    setNewEvent({ id: null, title: '', date: '', time: '', duration: '' });
    setShowModal(false);
    setEditMode(false);
  };

  const deleteEvent = (id) => {
    const filtered = events.filter(event => event.id !== id);
    setEvents(filtered);
  };

  const editEvent = (event) => {
    setNewEvent(event);
    setEditMode(true);
    setShowModal(true);
  };

  return (
    <div className="app">
      <h1>Calendar App</h1>

      <div className="calendar-header">
        <button onClick={goToPrevMonth}>◀</button>
        <h2>{currentDate.format('MMMM YYYY')}</h2>
        <button onClick={goToNextMonth}>▶</button>
      </div>

      <div className="actions">
        <button className="add-task-btn" onClick={() => {
          setNewEvent({ id: null, title: '', date: '', time: '', duration: '' });
          setEditMode(false);
          setShowModal(true);
        }}>
          ➕ Schedule a Task
        </button>
      </div>

      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div className="day-name" key={day}>{day}</div>
        ))}

        {daysArray.map((date, idx) => (
          <div
            key={idx}
            className={`calendar-cell ${isToday(date) ? 'today' : ''} ${date.month() !== currentDate.month() ? 'disabled' : ''}`}
          >
            <div className="day-number">{date.date()}</div>
            {getEventsForDate(date).map((event) => (
              <div key={event.id} className="event">
                <strong>{event.title}</strong><br />
                {event.time} ({event.duration})<br />
                <div className="event-buttons">
                  <button onClick={() => editEvent(event)}>Edit</button>
                  <button onClick={() => deleteEvent(event.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editMode ? 'Edit Task' : 'Schedule a Task'}</h2>
            <form onSubmit={addEvent}>
              <input type="text" name="title" placeholder="Title" value={newEvent.title} onChange={handleInputChange} required />
              <input type="date" name="date" value={newEvent.date} onChange={handleInputChange} required />
              <input type="time" name="time" value={newEvent.time} onChange={handleInputChange} required />
              <input type="text" name="duration" placeholder="Duration (e.g. 1h)" value={newEvent.duration} onChange={handleInputChange} />
              <div className="form-buttons">
                <button type="submit">{editMode ? 'Update' : 'Add'}</button>
                <button type="button" onClick={() => {
                  setShowModal(false);
                  setEditMode(false);
                  setNewEvent({ id: null, title: '', date: '', time: '', duration: '' });
                }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
