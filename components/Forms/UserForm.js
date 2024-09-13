import React, { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function UserForm({ onSubmit, initialData = {} }) {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    user_name: initialData.user_name || '',
    password: '',
    bio: initialData.bio || '',
    profile_picture: initialData.profile_picture || '',
    street_address: initialData.street_address || '',
    city: initialData.city || '',
    state: initialData.state || '',
    zip_code: initialData.zip_code || '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
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
      <Form.Group className="mb-3">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          name="user_name"
          placeholder="Enter username"
          value={formData.user_name}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <InputGroup>
          <Form.Control
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
            autocomplete="current-password"
          />
          <Button
            variant="outline-secondary"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </Button>
        </InputGroup>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Bio</Form.Label>
        <Form.Control
          as="textarea"
          name="bio"
          placeholder="Enter your bio"
          value={formData.bio}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Profile Picture</Form.Label>
        <Form.Control
          type="text"
          name="profile_picture"
          placeholder="Enter profile picture URL"
          value={formData.profile_picture}
          onChange={handleChange}
        />
        <Form.Text className="text-muted">Or upload an image:</Form.Text>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setFormData((prev) => ({ ...prev, profile_picture: reader.result }));
              };
              reader.readAsDataURL(file);
            }
          }}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Street Address</Form.Label>
        <Form.Control
          type="text"
          name="street_address"
          placeholder="Enter street address"
          value={formData.street_address}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>City</Form.Label>
        <Form.Control
          type="text"
          name="city"
          placeholder="Enter city"
          value={formData.city}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>State</Form.Label>
        <Form.Control
          type="text"
          name="state"
          placeholder="Enter state"
          value={formData.state}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Zip Code</Form.Label>
        <Form.Control
          type="text"
          name="zip_code"
          placeholder="Enter zip code"
          value={formData.zip_code}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        {initialData.name ? 'Update' : 'Register'}
      </Button>
    </Form>
  );
}

UserForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    name: PropTypes.string,
    user_name: PropTypes.string,
    bio: PropTypes.string,
    profile_picture: PropTypes.string,
    street_address: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    zip_code: PropTypes.string,
  }),
};

UserForm.defaultProps = {
  initialData: {},
};

export default UserForm;
