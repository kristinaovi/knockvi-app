// src/Components/Pages/Production/ProductionPlan.jsx
import React, { Fragment, useContext, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Nav,
  NavItem,
  NavLink,
  Button
} from "reactstrap";
import { Target, Info, CheckCircle, PlusCircle } from "react-feather";
import { Closed, All, Open, Add } from "../../../Constant";
import { Breadcrumbs } from "../../../AbstractElements";
import ProjectContext from "../../../_helper/Project/index";
import CustomizerContext from "../../../_helper/Customizer";
import ProductionPlanList from "./ProductionPlanList";
import NewProductionPlan from "./NewProductionPlan";

const ProductionPlan = () => {
  const { layoutURL } = useContext(CustomizerContext);
  const [activeTab, setActiveTab] = useState("1");
  const { allData } = useContext(ProjectContext);

  // Modal Add Production Plan
  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => setModalOpen(!modalOpen);

  return (
    <Fragment>
      <Breadcrumbs parent="Production" mainTitle="Production" />
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
                      onClick={toggleModal} // ✅ Panggil fungsi toggle
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
      <NewProductionPlan
        isOpen={modalOpen}
        toggle={toggleModal}
        onSuccess={() => {
          // Di sini bisa dipanggil ulang API list jika perlu
          console.log("Production Plan added successfully!");
        }}
      />
    </Fragment>
  );
};

export default ProductionPlan;
