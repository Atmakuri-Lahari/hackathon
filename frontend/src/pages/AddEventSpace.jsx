import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Form, Button, Alert } from "react-bootstrap";

// Cities and Locations Data
const citiesData = {
  Vijayawada: ["Labbipet", "Patamata", "Mogalrajpuram"],
  Hyderabad: ["L.B.Nagar", "Jubilee Hills", "Banjara Hills"],
  Vizag: ["Bhemilli", "Seethammadhara", "Rushikonda"],
};

const eventTypes = ["Banquet Hall", "Conference Room", "Auditorium", "Open Garden"];

const AddEventSpace = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    address: "",
    city: "",
    location: "",
    type: "",
    capacity: "",
    vegMeals: "",
    nonVegMeals: "",
    parkingAvailable: false,
    acAvailable: false,
    images: [],
    timeSlots: [],
  });

  const [locations, setLocations] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (name === "city") {
      setLocations(citiesData[value] || []);
      setFormData({ ...formData, city: value, location: "" });
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, images: e.target.files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "images") {
        Array.from(formData.images).forEach((file) => {
          formDataToSend.append("images", file);
        });
      } else if (key === "timeSlots") {
        formDataToSend.append("timeSlots", formData.timeSlots.join(","));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      await axios.post("http://localhost:5000/api/eventSpaces/add", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/event-spaces");
    } catch (error) {
      setError("Failed to add event space. Please try again.");
    }
  };

  return (
    <Container className="mt-4">
      <h2>Add Event Space</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Event Space Name</Form.Label>
          <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
        </Form.Group>

        <Form.Group>
          <Form.Label>Price</Form.Label>
          <Form.Control type="number" name="price" value={formData.price} onChange={handleChange} required />
        </Form.Group>

        <Form.Group>
          <Form.Label>Address</Form.Label>
          <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} required />
        </Form.Group>

        <Form.Group>
          <Form.Label>City</Form.Label>
          <Form.Control as="select" name="city" value={formData.city} onChange={handleChange} required>
            <option value="">Select City</option>
            {Object.keys(citiesData).map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Label>Location</Form.Label>
          <Form.Control as="select" name="location" value={formData.location} onChange={handleChange} required>
            <option value="">Select Location</option>
            {locations.map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Label>Event Type</Form.Label>
          <Form.Control as="select" name="type" value={formData.type} onChange={handleChange} required>
            <option value="">Select Event Type</option>
            {eventTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Label>Capacity</Form.Label>
          <Form.Control type="number" name="capacity" value={formData.capacity} onChange={handleChange} required />
        </Form.Group>

        <Form.Group>
          <Form.Label>Veg Meals</Form.Label>
          <Form.Control type="number" name="vegMeals" value={formData.vegMeals} onChange={handleChange} required />
        </Form.Group>

        <Form.Group>
          <Form.Label>Non-Veg Meals</Form.Label>
          <Form.Control type="number" name="nonVegMeals" value={formData.nonVegMeals} onChange={handleChange} required />
        </Form.Group>

        <Form.Group>
          <Form.Check
            type="checkbox"
            label="Parking Available"
            name="parkingAvailable"
            checked={formData.parkingAvailable}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group>
          <Form.Check type="checkbox" label="AC Available" name="acAvailable" checked={formData.acAvailable} onChange={handleChange} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Upload Images</Form.Label>
          <Form.Control type="file" name="images" multiple onChange={handleFileChange} required />
        </Form.Group>

        <Form.Group>
          <Form.Label>Time Slots</Form.Label>
          <Form.Control
            as="select"
            multiple
            name="timeSlots"
            value={formData.timeSlots}
            onChange={(e) => setFormData({ ...formData, timeSlots: Array.from(e.target.selectedOptions, (option) => option.value) })}
          >
            <option value="9 AM TO 3 PM">9 AM TO 3 PM</option>
            <option value="3 PM TO 6 PM">3 PM TO 6 PM</option>
            <option value="6 PM TO 11 PM">6 PM TO 11 PM</option>
            <option value="11 PM TO 8 AM">11 PM TO 8 AM</option>
          </Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary" className="mt-3">
          Add Event Space
        </Button>
      </Form>
    </Container>
  );
};

export default AddEventSpace;
