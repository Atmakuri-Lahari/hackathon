import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomNavbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddEventSpace from "./pages/AddEventSpace";
import EventSpaceList from "./pages/EventSpaceList";
import EventSpaceDetails from "./pages/EventSpaceDetails"; // Import the EventSpaceDetails page
import MyBookings from "./pages/MyBookings.jsx"; // Import the MyBookings page

const App = () => {
  return (
    <Router>
      <CustomNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add-event-space" element={<AddEventSpace />} />
        <Route path="/event-spaces" element={<EventSpaceList />} />
        <Route path="/event-space/:id" element={<EventSpaceDetails />} /> {/* Add event space details route */}
        <Route path="/my-bookings" element={<MyBookings />} /> {/* Add My Bookings route */}
      </Routes>
    </Router>
  );
};

export default App;
