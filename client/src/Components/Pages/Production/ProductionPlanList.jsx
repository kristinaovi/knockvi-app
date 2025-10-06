import React, { useEffect, useState } from "react";
import { useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  Table,
  Form,
  FormGroup,
  Input,
  Button,
  ModalFooter,
} from "reactstrap";
import DataTable from "react-data-table-component";
import { H5 } from "../../../AbstractElements";
import TableColumnFilter from "../../Filter/TableColumnFilter";
import { Filter } from "react-feather";
import useProductionPlan from "../../../Hooks/useProductionPlan";
import useProductionProcess from "../../../Hooks/useProductionProcess";
import useParts from "../../../Hooks/useParts";
import useMachines from "../../../Hooks/useMachines";
import axios from "../../../api/axios";


const ProductionPlanList = () => {
  const { items: productionPlans, fetchAll: fetchProductionPlans } =
    useProductionPlan();
  const { items: parts, fetchParts: fetchPartsAll } = useParts();
  const { items: machines, fetchAll: fetchMachinesAll } = useMachines();

  const [prodList, setProdList] = useState([]);
const [filters, setFilters] = useState({
  prod_code: "",
  part_name: "",
  machine_name: "",
  quantity_plan: "",
  quantity_actual: "",
  machine_status: "",
  remarks: "",

});

  const [showFilters, setShowFilters] = useState(false);

  

  // Save draft row (confirm before adding row officially)
  const saveDraftRow = (index) => {
    alert(`Row ${index + 1} disimpan sementara`);
  };

  // Cancel new row
  const cancelNewRow = (index) => {
    setNewRows((prev) => prev.filter((_, i) => i !== index));
  };

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [tableData, setTableData] = useState([]);
  const [newRows, setNewRows] = useState([]);

  // Fetch all data initially
  useEffect(() => {
    fetchPartsAll();
    fetchMachinesAll();
    fetchProductionPlans();
  }, [fetchPartsAll, fetchMachinesAll, fetchProductionPlans]);

  useEffect(() => {
    const mapped = productionPlans.map((p) => {
      const part = parts.find((x) => x.id === p.part_id);
      const machine = machines.find((x) => x.id === p.machine_id);
      return {
        ...p,
        part_name: part ? part.name : "",
        machine_name: machine ? machine.name : "",
      };
    });
    setProdList(mapped);
  }, [productionPlans, parts, machines]);

  const toggleFilter = () => setShowFilters((prev) => !prev);

  // Modal toggle
  const toggleModal = async (plan = null) => {
    if (plan) {
      setSelectedPlan(plan);
      setFormData({
        quantity_plan: plan.quantity_plan,
        quantity_actual: plan.quantity_actual || 0,
        remarks: plan.remarks || "",
        machine_no: plan.machine_no || "",
        machine_status: plan.machine_status || "",
      });
      setEditMode(false);

      // Fetch tableData / history
      try {
        const res = await axios.get(`/production_process/${plan.id}`);
        setTableData(res.data || []);
      } catch (err) {
        console.error(err);
        setTableData([]);
      }
      setNewRows([]);
    } else {
      setSelectedPlan(null);
      setTableData([]);
      setNewRows([]);
    }
    setModalOpen((prev) => !prev);
  };

  // Handle input changes for new rows
  const handleNewRowChange = (index, e) => {
    const { name, value } = e.target;
    setNewRows((prev) => {
      const updated = [...prev];
      updated[index][name] = value;
      return updated;
    });
  };

  const startAddNewRow = () => {
    setNewRows((prev) => [
      ...prev,
      {
        date: "",
        output_1: "",
        output_2: "",
      },
    ]);
  };

  const handleSave = async () => {
    if (!selectedPlan) return;

    // 🔹 definisikan planId
    const planId = selectedPlan.id;

    // 🔹 siapkan data untuk plan
    const planData = {
      part_id: selectedPlan.part_id,
      machine_id: formData.machine_id || selectedPlan.machine_id,
      status: formData.status || selectedPlan.status,
      quantity_plan: formData.quantity_plan || selectedPlan.quantity_plan,
      remarks: formData.remarks || selectedPlan.remarks,
    };

    // 🔹 siapkan data untuk process
    const processData = [
      ...tableData, // data lama
      ...newRows.map((row) => ({
        ...row,
        production_plan_id: selectedPlan.id,
        output_1: Number(row.output_1) || 0,
        output_2: Number(row.output_2) || 0,
      })),
    ];

    try {
      await axios.put(`/production_plan/save-both/${planId}`, { planData, processData })

      alert("Data berhasil disimpan!");
      toggleModal();
      fetchProductionPlans();
      setNewRows([]);
      setEditMode(false);
    } catch (err) {
      console.error(err);
      alert("Gagal simpan data!");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data ini?")) return;
    try {
      await axios.delete(`/production_process/${selectedPlan.id}`);
      alert("Data berhasil dihapus!");
      toggleModal(null);
      fetchProductionPlans();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus data!");
    }
  };

  const filteredData = prodList.filter((item) =>
    Object.keys(filters).every(
      (key) =>
        !filters[key] ||
        item[key]?.toString().toLowerCase().includes(filters[key].toLowerCase())
    )
  );

  // 2. baru hitung total pakai filteredData
  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, row) => {
        acc.issued += Number(row.issuedQty) || 0;
        acc.open += Number(row.openQty) || 0;
        return acc;
      },
      { issued: 0, open: 0 }
    );
  }, [filteredData]);

  const columns = [
    {
      name: "Production Code",
      selector: (row) => row.prod_code,
      sortable: true,
      cell: (row) => (
        <button
          className="btn btn-link p-0 text-primary"
          onClick={() => toggleModal(row)}
        >
          {row.prod_code}
        </button>
      ),
    },
    { name: "Part Name", selector: (row) => row.part_name, sortable: true },
    {
      name: "Machine No.",
      selector: (row) => row.machine_name,
      sortable: true,
    },
    {
      name: "Quantity Plan",
      selector: (row) => row.quantity_plan,
      sortable: true,
    },
    {
      name: "Quantity Actual",
      selector: (row) => row.quantity_actual || 0,
      sortable: true,
    },
    { name: "Machine Status", selector: (row) => row.status, sortable: true },
    { name: "Remarks", selector: (row) => row.remarks, sortable: false },
    {
      name: "Status",
      selector: (row) => (row.prod_status ? "Closed" : "Open"),
      sortable: true,
      cell: (row) => {
        const isClosed = !!row.prod_status;
        return (
          <span
            className={`badge ${isClosed ? "bg-success" : "bg-warning"}`}
            style={{ whiteSpace: "nowrap" }}
          >
            {isClosed ? "Closed" : "Open"}
          </span>
        );
      },
      minWidth: "90px",
      grow: 0.5,
      left: true,
    },
  ];

  return (
    <Card>
      <CardHeader className="card-no-border d-flex justify-content-between align-items-center">
        <H5>Production List</H5>
        <Filter
          className="cursor-pointer"
          onClick={() => setShowFilters((prev) => !prev)}
          size={18}
        />
      </CardHeader>
      <CardBody>
        {showFilters && (
          <Row className="mb-3">
            <Col>
              <TableColumnFilter filters={filters} setFilters={setFilters} />
            </Col>
          </Row>
        )}

        <DataTable
          className="support-table"
          columns={columns}
          data={filteredData}
          pagination
          striped
          persistTableHead
        />

        <div className="mt-2 d-flex justify-content-end">
          <table className="table table-bordered w-auto">
            <tbody>
              <tr>
                <th>Total Plan</th>
                <td>{totals.issued}</td>
                <th>Total Actual</th>
                <td>{totals.open}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Modal */}
        <Modal isOpen={modalOpen} toggle={() => toggleModal(null)} size="lg">
          <ModalHeader toggle={() => toggleModal(null)}>
            Details - {selectedPlan?.prod_code}
          </ModalHeader>
          <ModalBody>
            {selectedPlan && (
              <Form>
                {/* Row 1: Part Name | Machine No */}
                <Row className="mb-2">
                  <Col md={6}>
                    <FormGroup>
                      <strong>Part Name :</strong>
                      <br />
                      {selectedPlan.part_name}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <strong>Machine No. :</strong>
                      <br />
                      {editMode ? (
                        <Input
                          type="select"
                          value={
                            formData.machine_id || selectedPlan.machine_id || ""
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              machine_id: e.target.value,
                            })
                          }
                        >
                          <option value="">-- Select Machine --</option>
                          {machines.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name}
                            </option>
                          ))}
                        </Input>
                      ) : (
                        selectedPlan.machine_name
                      )}
                    </FormGroup>
                  </Col>
                </Row>

                {/* Row 2: Quantity Plan | Machine Status */}
                <Row className="mb-2">
                  <Col md={6}>
                    <FormGroup>
                      <strong>Quantity Plan :</strong>
                      <br />
                      {editMode ? (
                        <Input
                          type="number"
                          value={formData.quantity_plan}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              quantity_plan: e.target.value,
                            })
                          }
                        />
                      ) : (
                        selectedPlan.quantity_plan
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <strong>Machine Status :</strong>
                      <br />
                      {editMode ? (
                        <Input
                          type="select"
                          value={formData.status || selectedPlan.status || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              status: e.target.value,
                            })
                          }
                        >
                          <option value="">-- Select Status --</option>
                          <option value="Setting">Setting</option>
                          <option value="Repair">Repair</option>
                          <option value="Running">Running</option>
                        </Input>
                      ) : (
                        selectedPlan.status
                      )}
                    </FormGroup>
                  </Col>
                </Row>

                {/* Row 3: Remark */}
                <Row className="mb-2">
                  <Col md={6}>
                    <FormGroup>
                      <strong>Remark :</strong>
                      <br />
                      {editMode ? (
                        <Input
                          type="text"
                          value={formData.remarks || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              remarks: e.target.value,
                            })
                          }
                        />
                      ) : (
                        selectedPlan.remarks
                      )}
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            )}

            {/* Table */}
            <div className="table-responsive mt-3">
              <Table bordered striped>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Output Shift 1</th>
                    <th>Output Shift 2</th>
                    <th>Total</th>
                    {editMode && <th>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((item, idx) => (
                    <tr key={`saved-${idx}`}>
                      <td>{new Date(item.date).toLocaleDateString("en-CA")}</td>
                      <td>{item.output_1}</td>
                      <td>{item.output_2}</td>
                      <td>
                        {(Number(item.output_1) || 0) +
                          (Number(item.output_2) || 0)}
                      </td>
                    </tr>
                  ))}

                  {newRows.map((row, idx) => (
                    <tr key={`new-${idx}`}>
                      <td>
                        <Input
                          type="date"
                          name="date"
                          value={row.date}
                          onChange={(e) => handleNewRowChange(idx, e)}
                        />
                      </td>
                      <td>
                        <Input
                          type="number"
                          name="output_1"
                          value={row.output_1}
                          onChange={(e) => handleNewRowChange(idx, e)}
                        />
                      </td>
                      <td>
                        <Input
                          type="number"
                          name="output_2"
                          value={row.output_2}
                          onChange={(e) => handleNewRowChange(idx, e)}
                        />
                      </td>
                      <td>
                        <Input
                          readOnly
                          value={
                            (Number(row.output_1) || 0) +
                            (Number(row.output_2) || 0)
                          }
                        />
                      </td>
                      {editMode && (
                        <td>
                          <Button
                            color="success"
                            size="sm"
                            onClick={() => saveDraftRow(idx)}
                          >
                            ✓
                          </Button>{" "}
                          <Button
                            color="danger"
                            size="sm"
                            onClick={() => cancelNewRow(idx)}
                          >
                            ×
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}

                  {editMode && (
                    <tr>
                      <td colSpan="5" className="text-center">
                        <Button
                          size="sm"
                          color="primary"
                          onClick={startAddNewRow}
                        >
                          + Add Row
                        </Button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
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
};

export default ProductionPlanList;
