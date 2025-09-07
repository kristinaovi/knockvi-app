// src/Components/Pages/Users/UserList.jsx
import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import DataTable from "react-data-table-component";
import Select from "react-select";
import { H5 } from "../../../AbstractElements";
import { Filter } from "react-feather";

// Hooks
import useUsers from "../../../Hooks/useUsers"; // Pastikan path ini benar

const roleOptions = [
  { value: "Admin", label: "Admin" },
  { value: "User", label: "User" },
  { value: "Manager", label: "Manager" },
];

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const UserList = forwardRef((props, ref) => {
  const { items: users, loading, error, fetchAll: fetchUsers, createOrUpdate:updateItem } = useUsers();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(null);

  // Expose method ke parent supaya User.jsx bisa refresh tabel
  useImperativeHandle(ref, () => ({
    refreshUsers: fetchUsers,
  }));

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const toggleModal = (user) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        id: user.id,
        userName: user.name,
        userEmail: user.email,
        userDepartment: user.department,
        userBadge: user.badge_number,
        userRole: user.role,
        userStatus: user.status,
      });
    }
    setModalOpen((open) => !open);
    setEditMode(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (selected) => {
    setFormData((prev) => ({ ...prev, userRole: selected ? selected.value : "" }));
  };

  const handleStatusChange = (selected) => {
    setFormData((prev) => ({ ...prev, userStatus: selected ? selected.value : "" }));
  };

  const handleSave = async () => {
    if (!selectedUser?.id) return;
    try {
      await updateItem(formData); // Pastikan useUsers punya updateItem
      fetchUsers(); // refresh data
      setEditMode(false);
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      cell: (row) => (
        <Button color="link" onClick={() => toggleModal(row)}>
          {row.name}
        </Button>
      ),
      sortable: true,
    },
    { name: "Badge No", selector: (row) => row.badge_number, sortable: true },
    { name: "Department", selector: (row) => row.department, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true },
    { name: "Role", selector: (row) => row.role, sortable: true },
    {
      name: "Status",
      selector: (row) => row.status,
      cell: (row) => (
        <span
          className={`badge ${
            row.status === "Active" ? "bg-success" : "bg-warning"
          }`}
        >
          {row.status}
        </span>
      ),
      sortable: true,
    },
  ];

  return (
    <Card>
      <CardHeader className="card-no-border d-flex justify-content-between align-items-center">
        <H5>User List</H5>
        <div className="d-flex gap-2">
          <Filter className="cursor-pointer" size={18} />
        </div>
      </CardHeader>
      <CardBody className="pt-0">
        {loading && <p>Loading...</p>}
        {error && <p className="text-danger">Failed to load users</p>}
        {!loading && !error && (
          <DataTable columns={columns} data={users || []} striped pagination />
        )}

        <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} size="lg">
          <ModalHeader
            toggle={() => setModalOpen(false)}
            className="position-relative pe-5"
          >
            User Detail – {formData?.userName || selectedUser?.name}
            <Button
              className="position-absolute top-50 end-0 translate-middle-y me-5"
              color={editMode ? "success" : "primary"}
              onClick={() => {
                if (editMode) {
                  handleSave();
                } else {
                  setEditMode(true);
                }
              }}
            >
              {editMode ? "Save" : "Edit"}
            </Button>
          </ModalHeader>
          <ModalBody>
            {formData && (
              <>
                {editMode ? (
                  <Form>
                    <FormGroup>
                      <Label>Name</Label>
                      <Input
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Email</Label>
                      <Input
                        name="userEmail"
                        value={formData.userEmail}
                        onChange={handleChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Department</Label>
                      <Input
                        name="userDepartment"
                        value={formData.userDepartment}
                        onChange={handleChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Badge No</Label>
                      <Input
                        name="userBadge"
                        value={formData.userBadge}
                        onChange={handleChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Role</Label>
                      <Select
                        options={roleOptions}
                        value={roleOptions.find(opt => opt.value === formData.userRole) || null}
                        onChange={handleRoleChange}
                        isClearable
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Status</Label>
                      <Select
                        options={statusOptions}
                        value={statusOptions.find(opt => opt.value === formData.userStatus) || null}
                        onChange={handleStatusChange}
                        isClearable
                      />
                    </FormGroup>
                  </Form>
                ) : (
                  <div className="mb-3">
                    <p><strong>Name:</strong> {formData.userName}</p>
                    <p><strong>Email:</strong> {formData.userEmail}</p>
                    <p><strong>Department:</strong> {formData.userDepartment}</p>
                    <p><strong>Badge No:</strong> {formData.userBadge}</p>
                    <p><strong>Role:</strong> {formData.userRole}</p>
                    <p><strong>Status:</strong> {formData.userStatus}</p>
                  </div>
                )}
              </>
            )}
          </ModalBody>
        </Modal>
      </CardBody>
    </Card>
  );
});

export default UserList;
