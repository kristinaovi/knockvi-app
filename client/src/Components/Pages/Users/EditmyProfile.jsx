import React, { Fragment } from "react";
import { Btn, H4 } from "../../../AbstractElements";
import { useForm } from "react-hook-form";
import {
  Row,
  Col,
  CardHeader,
  CardBody,
  CardFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import {
  EditProfile,
  Company,
  Username,
  UsersCountryMenu,
  AboutMe,
  UpdateProfile,
  FirstName,
  LastName,
  Address,
  EmailAddress,
  PostalCode,
  Country,
  City,
} from "../../../Constant";

const EditMyProfile = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onEditSubmit = (data) => {
    alert(data);
  };
  return (
    <Fragment>
      <Form className="card" onSubmit={handleSubmit(onEditSubmit)}>
        <CardHeader>
          <H4 attrH4={{ className: "card-title mb-0" }}>Change Password</H4>
          <div className="card-options">
            <a className="card-options-collapse" href="#javascript">
              <i className="fe fe-chevron-up"></i>
            </a>
            <a className="card-options-remove" href="#javascript">
              <i className="fe fe-x"></i>
            </a>
          </div>
        </CardHeader>
        <CardBody>
          <Row>
            <Row className="g-3 align-items-end">
              <Col md="4">
                <FormGroup>
                  <Label className="form-label">Old Password</Label>
                  <Input
                    className="form-control"
                    type="password"
                    placeholder="********"
                    {...register("OldPassword", { required: true })}
                  />
                  <span style={{ color: "red" }}>
                    {errors.OldPassword && "Old Password is required"}
                  </span>
                </FormGroup>
              </Col>

              <Col md="4">
                <FormGroup>
                  <Label className="form-label">New Password</Label>
                  <Input
                    className="form-control"
                    type="password"
                    placeholder="********"
                    {...register("NewPassword", { required: true })}
                  />
                  <span style={{ color: "red" }}>
                    {errors.NewPassword && "New Password is required"}
                  </span>
                </FormGroup>
              </Col>

              <Col md="4">
                <FormGroup>
                  <Label className="form-label">Confirm New Password</Label>
                  <Input
                    className="form-control"
                    type="password"
                    placeholder="********"
                    {...register("ConfirmNewPassword", { required: true })}
                  />
                  <span style={{ color: "red" }}>
                    {errors.ConfirmNewPassword &&
                      "Confirm New Password is required"}
                  </span>
                </FormGroup>
              </Col>
            </Row>
          </Row>
        </CardBody>
        <CardFooter className="text-end">
          <Btn attrBtn={{ color: "primary", type: "submit" }}>Save</Btn>
        </CardFooter>
      </Form>
    </Fragment>
  );
};
export default EditMyProfile;
