import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import { Container, Form, Button, Card } from "react-bootstrap";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      window.dispatchEvent(new Event("storage")); // ✅ Force Navbar update
      alert("Login successful! Redirecting to Home...");
      navigate("/");
    } catch (error) {
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "28rem" }} className="shadow p-4">
        <Card.Body>
          <h2 className="text-center mb-4">Login</h2>
          <Form onSubmit={handleSubmit}>
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

            {/* Login Button */}
            <Button variant="primary" type="submit" className="w-100">
              Login
            </Button>
          </Form>

          {/* Redirect to Register */}
          <p className="mt-3 text-center">
            Not registered?{" "}
            <span
              className="text-primary"
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => navigate("/register")}
            >
              Sign up here
            </span>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
