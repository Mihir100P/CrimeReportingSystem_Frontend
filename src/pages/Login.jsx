import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthContext } from "../context/AuthContext";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";

const Login = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");

    const result = await login(data.email, data.password);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message);
    }

    setIsLoading(false);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100 container">
      <Card className="shadow-lg border-0 p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <Card.Body>
          <h2 className="text-center text-primary fw-bold">Sign In</h2>
          <p className="text-muted text-center">Access your account</p>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit(onSubmit)} className="mt-4">
            {/* Email Field */}
            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
            </Form.Group>

            {/* Password Field */}
            <Form.Group controlId="password" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                {...register("password", { required: "Password is required" })}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
            </Form.Group>

            {/* Submit Button */}
            <Button type="submit" variant="primary" className="w-100" disabled={isLoading}>
              {isLoading ? <Spinner animation="border" size="sm" /> : "Sign In"}
            </Button>
          </Form>

          {/* Register Link */}
          <div className="text-center mt-3">
            <p className="text-muted">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary fw-bold">
                Sign up
              </Link>
            </p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
