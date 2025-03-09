import { useEffect, useState } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { getAllEventSpaces } from "../services/api";
import { useNavigate } from "react-router-dom";

const EventSpaceList = () => {
  const [eventSpaces, setEventSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventSpaces = async () => {
      try {
        const res = await getAllEventSpaces();
        setEventSpaces(res.data);
      } catch (error) {
        console.error("Error fetching event spaces:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEventSpaces();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <Container className="mt-4">
      <h2>Available Event Spaces</h2>
      <Row>
        {eventSpaces.length > 0 ? (
          eventSpaces.map((eventSpace) => (
            <Col md={4} key={eventSpace._id} className="mb-3">
              <Card>
                <Card.Img 
                  variant="top" 
                  src={`http://localhost:5000${eventSpace.images[0]}`} 
                  style={{ height: "200px", objectFit: "cover" }} 
                />
                <Card.Body>
                  <Card.Title>{eventSpace.name}</Card.Title>
                  <Card.Text>{eventSpace.city}, {eventSpace.location}</Card.Text>
                  <Button variant="primary" onClick={() => navigate(`/event-space/${eventSpace._id}`)}>
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>No event spaces available.</p>
        )}
      </Row>
    </Container>
  );
};

export default EventSpaceList;
