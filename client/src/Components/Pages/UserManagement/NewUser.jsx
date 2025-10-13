import React, { useState, useEffect } from 'react';
import {
  Modal, ModalHeader, ModalBody, Button, Form, FormGroup,
  Label, Input, ModalFooter, Row, Col
} from 'reactstrap';
import Select from 'react-select';
import useUsers from '../../../Hooks/useUsers';

const NewUser = ({ isOpen, toggle }) => {
  const { createOrUpdate: saveUser } = useUsers();

  const [roleOptions, setRoleOptions] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  const [userData, setUserData] = useState({
    userName: '',
    userBadge: '',
    userDepartment: '',
    userEmail: '',
    userRole: '',
    userStatus: '',
    password: ''
  });

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
  ];

  // 🔹 Fetch roles dari database
useEffect(() => {
  const fetchRoles = async () => {
    const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000';
    try {
      const res = await fetch(`${API_BASE}/api/roles`);
      const data = await res.json();

      // hasil query = [{ role: 'Admin' }, { role: 'Logistic Staff' }, ...]
      const formatted = data.map((r) => ({
        value: r.role,
        label: r.role,
      }));

      setRoleOptions(formatted);
    } catch (error) {
      console.error('Failed to load roles:', error);
    } finally {
      setLoadingRoles(false);
    }
  };

  fetchRoles();
}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (opt) => {
    setUserData((prev) => ({ ...prev, userRole: opt ? opt.value : '' }));
  };

  const handleStatusChange = (opt) => {
    setUserData((prev) => ({ ...prev, userStatus: opt ? opt.value : '' }));
  };

  const handleSave = async () => {
    if (!userData.userName || !userData.userEmail) {
      return alert('Name and Email are required!');
    }

    try {
      await saveUser(userData); // kirim semua data termasuk role
      setUserData({
        userName: '',
        userBadge: '',
        userDepartment: '',
        userEmail: '',
        userRole: '',
        userStatus: '',
        userPassword: '',
        userPhoto: '',
      });
      toggle();
    } catch (err) {
      console.error(err);
      alert(`Failed to save user: ${err.message || 'Unknown error'}`);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>Add New User</ModalHeader>
      <ModalBody>
        <Form>
          <Row>
            <Col md="6">
              <FormGroup>
                <Label><strong>Badge No</strong></Label>
                <Input
                  name="userBadge"
                  value={userData.userBadge}
                  onChange={handleChange}
                  placeholder="Enter badge number"
                />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label><strong>Full Name</strong></Label>
                <Input
                  name="userName"
                  value={userData.userName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md="6">
              <FormGroup>
                <Label><strong>Department</strong></Label>
                <Input
                  name="userDepartment"
                  value={userData.userDepartment}
                  onChange={handleChange}
                  placeholder="Enter department"
                />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label><strong>Email</strong></Label>
                <Input
                  type="email"
                  name="userEmail"
                  value={userData.userEmail}
                  onChange={handleChange}
                  placeholder="user@example.com"
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md="6">
              <FormGroup>
                <Label><strong>Role</strong></Label>
                <Select
                  options={roleOptions}
                  value={roleOptions.find(opt => opt.value === userData.userRole) || null}
                  onChange={handleRoleChange}
                  isClearable
                  isLoading={loadingRoles}
                  placeholder={loadingRoles ? "Loading roles..." : "Select role..."}
                />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label><strong>Status</strong></Label>
                <Select
                  options={statusOptions}
                  value={statusOptions.find(opt => opt.value === userData.userStatus) || null}
                  onChange={handleStatusChange}
                  isClearable
                  placeholder="Select status..."
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md="6">
              <FormGroup>
                <Label><strong>Upload Photo</strong></Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setUserData(prev => ({ ...prev, userPhoto: reader.result }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {userData.userPhoto && (
                  <div className="mt-2 text-center">
                    <img
                      src={userData.userPhoto}
                      alt="Preview"
                      className="rounded-circle"
                      width="120"
                      height="120"
                    />
                  </div>
                )}
              </FormGroup>
            </Col>

            <Col md="6">
              <FormGroup>
                <Label><strong>Password</strong></Label>
                <Input
                  type="password"
                  name="userPassword"
                  value={userData.userPassword}
                  onChange={handleChange}
                  placeholder="********"
                />
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </ModalBody>

      <ModalFooter>
        <Button color="primary" onClick={handleSave}>
          Save
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default NewUser;
