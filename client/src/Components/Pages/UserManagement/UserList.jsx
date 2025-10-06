// src/Components/Pages/Users/UserList.jsx
import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
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
  ModalFooter,
  Row,
  Col,
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
  const {
    items: users,
    loading,
    error,
    fetchAll: fetchUsers,
    createOrUpdate: updateItem,
  } = useUsers();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
const [formData, setFormData] = useState({
  userName: "",
  userEmail: "",
  userDepartment: "",
  userBadge: "",
  userRole: "",
  userStatus: "",
  userPhoto: null,
});

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
    setFormData((prev) => ({
      ...prev,
      userRole: selected ? selected.value : "",
    }));
  };

  const handleStatusChange = (selected) => {
    setFormData((prev) => ({
      ...prev,
      userStatus: selected ? selected.value : "",
    }));
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
        <Button className="btn btn-link p-0 text-primary" color="link" onClick={() => toggleModal(row)}>
          {row.name}
        </Button>
      ),
      sortable: true,
    },
    { name: "Badge No", selector: (row) => row.badge_number, sortable: true, grow: 0.8, left: true },
    { name: "Department", selector: (row) => row.department, sortable: true, grow: 0.8, left: true },
{
  name: "Email",
  selector: row => row.email,
  sortable: true,
  grow: 1,
  left: true,
  style: {
    justifyContent: "flex-start",
    textAlign: "left",
  },
  headerStyle: {
    justifyContent: "flex-start",
    textAlign: "left",
  },
},

    { name: "Role", selector: (row) => row.role, sortable: true, grow: 0.8, left: true },
    {
      name: "Status",
      selector: (row) => row.status,
      grow: 0.5,
      left: true,
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
          <DataTable   className="support-table" columns={columns} data={users || []} striped pagination />
        )}

        <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} size="lg">
          <ModalHeader
            toggle={() => setModalOpen(false)}
            className="position-relative pe-5"
          >
            Details – {formData?.userName || selectedUser?.name}
          </ModalHeader>
          <ModalBody>
            <div className="mb-3">
              <Row>
                {/* Foto Bulat */}
                <Col md="3" className="text-center">
                  {formData && (
                    <img
                      src={
                        formData.userPhoto || "https://i.pravatar.cc/150?img=12"
                      }
                      alt="User"
                      className="rounded-circle border"
                      width="120"
                      height="120"
                    />
                  )}
                </Col>

                {/* Data User */}
                <Col md="9">
                  <Row className="mb-2">
                    <Col md={6}>
                      <FormGroup>
                        <strong>Name:</strong>
                        <br />
                        {formData.userName}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <strong>Email:</strong>
                        <br />
                        {formData.userEmail}
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row className="mb-2">
                    <Col md={6}>
                      <FormGroup>
                        <strong>Department:</strong>
                        <br />
                        {formData.userDepartment}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <strong>Badge No:</strong>
                        <br />
                        {formData.userBadge}
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row className="mb-2">
                    <Col md={6}>
                      <FormGroup>
                        <strong>Role:</strong>
                        <br />
                        {formData.userRole}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <strong>Status:</strong>
                        <br />
                        <span
                          className={`badge ${
                            formData.userStatus === "Active"
                              ? "bg-success"
                              : "bg-warning"
                          }`}
                        >
                          {formData.userStatus}
                        </span>
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </ModalBody>
          <ModalFooter>
            {editMode ? (
              <>
                <Button color="success" onClick={handleSave}>
                  Save
                </Button>
                <Button color="secondary" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button color="primary" onClick={() => setEditMode(true)}>
                Edit
              </Button>
            )}
          </ModalFooter>
        </Modal>
      </CardBody>
    </Card>
  );
});

export default UserList;
