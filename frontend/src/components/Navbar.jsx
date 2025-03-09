import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

const CustomNavbar = () => {
  const [role, setRole] = useState(localStorage.getItem("role"));
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setRole(localStorage.getItem("role")); // Update role dynamically
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    setRole(null);
    navigate("/");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Event Booking</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>

            {/* User Navbar */}
            {role === "user" && (
              <>
                <Nav.Link as={Link} to="/my-bookings">My Bookings</Nav.Link>
                <Button variant="danger" onClick={handleLogout} className="ms-2">Logout</Button>
              </>
            )}

            {/* Owner Navbar */}
            {role === "owner" && (
              <>
                <Nav.Link as={Link} to="/add-event-space">Add Event Space</Nav.Link>
                <Nav.Link as={Link} to="/my-bookings">My Bookings</Nav.Link>
                <Button variant="danger" onClick={handleLogout} className="ms-2">Logout</Button>
              </>
            )}

            {/* Admin Navbar */}
            {role === "admin" && (
              <>
                <Nav.Link as={Link} to="/admin-panel">Admin Panel</Nav.Link>
                <Button variant="danger" onClick={handleLogout} className="ms-2">Logout</Button>
              </>
            )}

            {/* Guest (Not Logged In) */}
            {!role && (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
