import React, { Fragment, useContext, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Nav,
  NavItem,
  NavLink,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { Target, Info, CheckCircle, PlusCircle } from "react-feather";
import { Closed, All, Open, Add } from "../../../Constant";
import { Breadcrumbs } from "../../../AbstractElements";
import ProjectContext from "../../../_helper/Project/index";
import CustomizerContext from "../../../_helper/Customizer";
import ProductionPlanList from "./ProductionPlanList";

const ProductionPlan = () => {
  const { layoutURL } = useContext(CustomizerContext);
  const [activeTab, setActiveTab] = useState("1");
  const { allData } = useContext(ProjectContext);

  // Modal Add Production Plan
  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => setModalOpen(!modalOpen);

  const [formData, setFormData] = useState({
    prodName: "",
    prodMC: "",
    prodOutput: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Saving data:", formData);
    // TODO: Panggil API ke backend (POST /api/production-plans)
    toggleModal();
    setFormData({ prodName: "", prodMC: "", prodOutput: "" });
  };

  return (
    <Fragment>
      <Breadcrumbs
        parent="Production"
        mainTitle="Production"
      />
      <Container fluid={true}>
        <Row className="project-card">
          <Col md="12" className="project-list">
            <Card>
              <Row>
                <Col md="6">
                  <Nav tabs className="border-tab">
                    <NavItem>
                      <NavLink
                        className={activeTab === "1" ? "active" : ""}
                        onClick={() => setActiveTab("1")}
                      >
                        <Target />
                        {All}
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={activeTab === "2" ? "active" : ""}
                        onClick={() => setActiveTab("2")}
                      >
                        <Info />
                        {Open}
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={activeTab === "3" ? "active" : ""}
                        onClick={() => setActiveTab("3")}
                      >
                        <CheckCircle />
                        {Closed}
                      </NavLink>
                    </NavItem>
                  </Nav>
                </Col>
                <Col md="6">
                  <div className="text-end">
                    <button
                      className="btn btn-primary me-2"
                      onClick={toggleModal}
                    >
                      <PlusCircle /> {Add}
                    </button>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* List Data */}
          <Col>
            <ProductionPlanList />
          </Col>
        </Row>
      </Container>

      {/* Modal Add Production Plan */}
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Add Production Plan</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="prodName">Production Name</Label>
              <Input
                type="text"
                id="prodName"
                name="prodName"
                value={formData.prodName}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="prodMC">Machine</Label>
              <Input
                type="text"
                id="prodMC"
                name="prodMC"
                value={formData.prodMC}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="prodOutput">Output</Label>
              <Input
                type="number"
                id="prodOutput"
                name="prodOutput"
                value={formData.prodOutput}
                onChange={handleChange}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleSave}>
            Save
          </Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  );
};

export default ProductionPlan;
