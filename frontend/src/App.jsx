import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

function App() {
  const [events, setEvents] = useState([]);

  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [showRegisterId, setShowRegisterId] = useState(null);

  const [registrationForm, setRegistrationForm] = useState({
    name: "",
    email: "",
  });

  const fetchEvents = async () => {
    const response = await axios.get(`${API}/events`);

    setEvents(response.data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEventChange = (e) => {
    setEventForm({
      ...eventForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegistrationChange = (e) => {
    setRegistrationForm({
      ...registrationForm,
      [e.target.name]: e.target.value,
    });
  };

  const submitEvent = async (e) => {
    e.preventDefault();

    if (editingId) {
      await axios.put(`${API}/events/${editingId}`, eventForm);

      setEditingId(null);
    } else {
      await axios.post(`${API}/events`, eventForm);
    }

    setEventForm({
      title: "",
      description: "",
      date: "",
      location: "",
    });

    fetchEvents();
  };

  const editEvent = (event) => {
    setEditingId(event._id);

    setEventForm({
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
    });
  };

  const deleteEvent = async (id) => {
    await axios.delete(`${API}/events/${id}`);

    fetchEvents();
  };

  const registerForEvent = async (eventId) => {
    if (!registrationForm.name || !registrationForm.email) {
      alert("Enter name and email");
      return;
    }

    await axios.post(`${API}/registrations`, {
      ...registrationForm,
      eventId,
    });

    alert("Registered Successfully");

    setRegistrationForm({
      name: "",
      email: "",
    });

    setShowRegisterId(null);
  };

  return (
    <div className="container">
      <h1>Event Registration App</h1>

      <div className="card">
        <h2>{editingId ? "Edit Event" : "Create Event"}</h2>

        <form onSubmit={submitEvent}>
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={eventForm.title}
            onChange={handleEventChange}
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={eventForm.description}
            onChange={handleEventChange}
            required
          />

          <input
            type="text"
            name="date"
            placeholder="Date"
            value={eventForm.date}
            onChange={handleEventChange}
            required
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={eventForm.location}
            onChange={handleEventChange}
            required
          />

          <button type="submit">
            {editingId ? "Update Event" : "Add Event"}
          </button>
        </form>
      </div>

      <h2>All Events</h2>

      {events.map((event) => (
        <div className="card" key={event._id}>
          <h3>{event.title}</h3>

          <p>{event.description}</p>

          <p>
            <strong>Date:</strong> {event.date}
          </p>

          <p>
            <strong>Location:</strong> {event.location}
          </p>

          <button onClick={() => editEvent(event)}>
            Edit
          </button>

          <button onClick={() => deleteEvent(event._id)}>
            Delete
          </button>

          <button
            onClick={() =>
              setShowRegisterId(
                showRegisterId === event._id
                  ? null
                  : event._id
              )
            }
          >
            Register
          </button>

          {showRegisterId === event._id && (
            <div style={{ marginTop: "15px" }}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={registrationForm.name}
                onChange={handleRegistrationChange}
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={registrationForm.email}
                onChange={handleRegistrationChange}
              />

              <button
                onClick={() =>
                  registerForEvent(event._id)
                }
              >
                Submit Registration
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;