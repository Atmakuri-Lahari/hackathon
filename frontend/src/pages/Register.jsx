import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import { Container, Form, Button, Card } from "react-bootstrap";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "user" });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      localStorage.setItem("role", formData.role);
      window.dispatchEvent(new Event("storage")); // ✅ Force Navbar update
      alert("Registered successfully! Redirecting to Home...");
      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert("Your email is not approved for registering as an Event Space Owner.");
      } else {
        alert("Registration failed. Try again.");
      }
    }
  };
  

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "28rem" }} className="shadow p-4">
        <Card.Body>
          <h2 className="text-center mb-4">Register</h2>
          <Form onSubmit={handleSubmit}>
            {/* Name Input */}
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Email Input */}
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Password Input */}
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Role Selection */}
            <Form.Group className="mb-3">
              <Form.Label>Register as</Form.Label>
              <Form.Select name="role" value={formData.role} onChange={handleChange}>
                <option value="user">User</option>
                <option value="owner">Event Space Owner</option>
              </Form.Select>
            </Form.Group>

            {/* Submit Button */}
            <Button variant="success" type="submit" className="w-100">
              Register
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;
