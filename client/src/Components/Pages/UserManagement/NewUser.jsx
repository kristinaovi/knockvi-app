import React, { useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import Select from 'react-select';
import useUsers from '../../../Hooks/useUsers'; // Gunakan hook abstraksi

const NewUser = ({ isOpen, toggle }) => {
  const { createOrUpdate: saveUser } = useUsers(); // Ambil method create/update user

  const [userData, setUserData] = useState({
    userName: '',
    userBadge: '',
    userDepartment: '',
    userEmail: '',
    userRole: '',
    userStatus: '',
    password: ''
  });

  const roleOptions = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Manager', label: 'Manager' },
    { value: 'Staff', label: 'Staff' },
  ];

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
  ];

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
      await saveUser(userData); // Panggil hook abstraksi
      setUserData({
        userName: '',
        userBadge: '',
        userDepartment: '',
        userEmail: '',
        userRole: '',
        userStatus: '',
      });
      toggle();
    } catch (err) {
      console.error(err);
      alert(`Failed to save user: ${err.message || 'Unknown error'}`);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="md">
      <ModalHeader toggle={toggle}>Add New User</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label><strong>Name</strong></Label>
            <Input
              name="userName"
              value={userData.userName}
              onChange={handleChange}
              placeholder="Enter full name"
            />
          </FormGroup>
          <FormGroup>
            <Label><strong>Badge No</strong></Label>
            <Input
              name="userBadge"
              value={userData.userBadge}
              onChange={handleChange}
              placeholder="Badge number"
            />
          </FormGroup>
          <FormGroup>
            <Label><strong>Department</strong></Label>
            <Input
              name="userDepartment"
              value={userData.userDepartment}
              onChange={handleChange}
              placeholder="Department name"
            />
          </FormGroup>
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
          <FormGroup>
            <Label><strong>Role</strong></Label>
            <Select
              options={roleOptions}
              value={roleOptions.find(opt => opt.value === userData.userRole) || null}
              onChange={handleRoleChange}
              isClearable
              placeholder="Select role..."
            />
          </FormGroup>
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
          <FormGroup>
            <Label><strong>Password</strong></Label>
            <Input
              type="text"
              name="password"
              value={userData.password}
              onChange={handleChange}
              placeholder="Enter Password"
            />
          </FormGroup>
        </Form>
        <div className="text-end mt-3">
          <Button color="success" onClick={handleSave}>
            Save
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default NewUser;
