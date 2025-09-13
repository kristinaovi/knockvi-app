import React, { Fragment } from "react";
import { Btn, H4 } from "../../../AbstractElements";
import { useForm, Controller } from "react-hook-form";
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
import { useChangePassword } from "../../../Hooks/useChangePassword"; 
import { toast } from "react-toastify";

const EditMyProfile = () => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const { changePassword, loading } = useChangePassword();

  const onEditSubmit = async (data) => {
    console.log("Submitting form with:", data); // debug
    if (data.NewPassword !== data.ConfirmNewPassword) {
      return toast.error("New Password and Confirm Password must match");
    }
    await changePassword(data.OldPassword, data.NewPassword);
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
          <Row className="g-3 align-items-end">
            {/* Old Password */}
            <Col md="4">
              <FormGroup>
                <Label className="form-label">Old Password</Label>
                <Controller
                  name="OldPassword"
                  control={control}
                  rules={{ required: "Old Password is required" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="password"
                      className="form-control"
                      placeholder="********"
                    />
                  )}
                />
                <span style={{ color: "red" }}>
                  {errors.OldPassword?.message}
                </span>
              </FormGroup>
            </Col>

            {/* New Password */}
            <Col md="4">
              <FormGroup>
                <Label className="form-label">New Password</Label>
                <Controller
                  name="NewPassword"
                  control={control}
                  rules={{ required: "New Password is required" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="password"
                      className="form-control"
                      placeholder="********"
                    />
                  )}
                />
                <span style={{ color: "red" }}>
                  {errors.NewPassword?.message}
                </span>
              </FormGroup>
            </Col>

            {/* Confirm New Password */}
            <Col md="4">
              <FormGroup>
                <Label className="form-label">Confirm New Password</Label>
                <Controller
                  name="ConfirmNewPassword"
                  control={control}
                  rules={{ required: "Confirm New Password is required" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="password"
                      className="form-control"
                      placeholder="********"
                    />
                  )}
                />
                <span style={{ color: "red" }}>
                  {errors.ConfirmNewPassword?.message}
                </span>
              </FormGroup>
            </Col>
          </Row>
        </CardBody>
        <CardFooter className="text-end">
          <Btn
            attrBtn={{ color: "primary", type: "submit", disabled: loading }}
          >
            {loading ? "Saving..." : "Save"}
          </Btn>
        </CardFooter>
      </Form>
    </Fragment>
  );
};

export default EditMyProfile;
