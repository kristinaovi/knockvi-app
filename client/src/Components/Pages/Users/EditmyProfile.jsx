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
import { useChangePassword } from "../../../Hooks/useChangePassword"; // import hook
import { toast } from "react-toastify";

const EditMyProfile = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
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
