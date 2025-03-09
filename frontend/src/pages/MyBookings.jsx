import { useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";
import { getUserBookings } from "../services/api";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await getUserBookings();
        setBookings(res.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    fetchBookings();
  }, []);

  return (
    <Container className="mt-4">
      <h2>My Bookings</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Event Space</th>
            <th>Status</th>
            <th>Booked On</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td>{booking.eventSpace.name}</td>
              <td>{booking.status}</td>
              <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default MyBookings;
