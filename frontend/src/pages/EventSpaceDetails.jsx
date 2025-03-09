import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button, Carousel, Card, ListGroup, Form } from "react-bootstrap";
import { getEventSpaceById, bookEventSpace } from "../services/api";

const EventSpaceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [eventSpace, setEventSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(""); 
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedMeal, setSelectedMeal] = useState("");
  const [numPeople, setNumPeople] = useState(1);
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    if (!id) return;

    const fetchEventSpace = async () => {
      try {
        setLoading(true);
        const response = await getEventSpaceById(id, selectedDate); 
        setEventSpace(response.data);
        setAvailableSlots(response.data.availableSlots || []); 
      } catch (err) {
        console.error("Error fetching event space details:", err);
        setError("Failed to load event space details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventSpace();
  }, [id, selectedDate]); 
  const handleBooking = async () => {
    if (!selectedDate || !selectedSlot || !selectedMeal || !numPeople) {
      return alert("All fields are required.");
    }
  
    const bookingData = {
      date: selectedDate,
      timeSlot: selectedSlot,
      mealType: selectedMeal,
      numPeople,
      userId: localStorage.getItem("userId"), // Get user ID from localStorage
    };
  
    try {
      const token = localStorage.getItem("token");
      console.log(token)
      await axios.post(
        `http://localhost:5000/api/eventSpaces/${id}/book`,
        bookingData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Booking Successful!");
      navigate("/my-bookings");
    } catch (error) {
      alert(error.response?.data?.error || "Booking failed. Please try again.");
    }
  };
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!eventSpace) return <p>No event space found.</p>;

  return (
    <Container className="mt-4">
      <h2>{eventSpace.name}</h2>

      {/* Carousel for Images */}
      <Carousel className="mb-4">
        {eventSpace.images?.length > 0 ? (
          eventSpace.images.map((img, index) => (
            <Carousel.Item key={index}>
              <img 
                className="d-block w-100" 
                src={`http://localhost:5000${img}`} 
                alt={`Slide ${index + 1}`} 
                style={{ maxHeight: "400px", objectFit: "cover" }} 
              />
            </Carousel.Item>
          ))
        ) : (
          <p>No images available</p>
        )}
      </Carousel>

      {/* Event Space Details */}
      <Card>
        <Card.Body>
          <Card.Title>Details</Card.Title>
          <ListGroup>
            <ListGroup.Item><strong>Type:</strong> {eventSpace.type}</ListGroup.Item>
            <ListGroup.Item><strong>Location:</strong> {eventSpace.city}, {eventSpace.location}</ListGroup.Item>
            <ListGroup.Item><strong>Price:</strong> ₹{eventSpace.price}</ListGroup.Item>
            <ListGroup.Item><strong>Capacity:</strong> {eventSpace.capacity} people</ListGroup.Item>
            <ListGroup.Item><strong>Parking:</strong> {eventSpace.parkingAvailable ? "Available" : "Not Available"}</ListGroup.Item>
            <ListGroup.Item><strong>AC:</strong> {eventSpace.acAvailable ? "Available" : "Not Available"}</ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>

      {/* Booking Section */}
      <Card className="mt-3">
        <Card.Body>
          <Card.Title>Book This Space</Card.Title>

          {/* Select Date */}
          <Form.Group className="mb-3">
            <Form.Label>Select Date</Form.Label>
            <Form.Control 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)} 
            />
          </Form.Group>

          {/* Select Meal */}
          <Form.Group className="mb-3">
            <Form.Label>Meal Options</Form.Label>
            <div>
              <Form.Check 
                type="radio" 
                label={`Veg - ₹${eventSpace.meals?.veg}`} 
                name="meal" 
                value="veg" 
                onChange={(e) => setSelectedMeal(e.target.value)}
              />
              <Form.Check 
                type="radio" 
                label={`Non-Veg - ₹${eventSpace.meals?.nonVeg}`} 
                name="meal" 
                value="nonVeg" 
                onChange={(e) => setSelectedMeal(e.target.value)}
              />
            </div>
          </Form.Group>

          {/* Select Available Time Slot */}
          <Form.Group className="mb-3">
            <Form.Label>Available Time Slots</Form.Label>
            <Form.Select 
              disabled={!selectedDate} 
              onChange={(e) => setSelectedSlot(e.target.value)}
            >
              <option value="">Select a time slot</option>
              {availableSlots.length > 0 ? (
                availableSlots.map((slot, index) => (
                  <option key={index} value={slot}>{slot}</option>
                ))
              ) : (
                <option disabled>No slots available</option>
              )}
            </Form.Select>
          </Form.Group>

          {/* Number of People */}
          <Form.Group className="mb-3">
            <Form.Label>Number of People</Form.Label>
            <Form.Control 
              type="number" 
              value={numPeople} 
              min="1" 
              max={eventSpace.capacity} 
              onChange={(e) => setNumPeople(e.target.value)} 
            />
          </Form.Group>

          {/* Book Now Button */}
          <Button variant="primary" onClick={handleBooking}>
            Book Now
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EventSpaceDetails;
