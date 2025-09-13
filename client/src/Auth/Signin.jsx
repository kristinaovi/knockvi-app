import React, { Fragment, useState, useEffect, useContext } from "react"
import { Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap"
import { Btn, H4, P } from "../AbstractElements"
import {
  EmailAddress,
  ForgotPassword,
  Password,
  RememberPassword,
  SignIn
} from "../Constant"
import { useNavigate } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"

import CustomizerContext from "../_helper/Customizer"
import OtherWay from "./OtherWay"

// <-- new import of your Axios wrapper
import api from "../api/axios"

import man from "../assets/images/dashboard/profile.png"

const Signin = ({ selected }) => {
  const [email, setEmail] = useState("example@nissinjpn.co.jp")
  const [password, setPassword] = useState("test123")
  const [togglePassword, setTogglePassword] = useState(false)
  const navigate = useNavigate()
  const { layoutURL } = useContext(CustomizerContext)

  const [value, setValue] = useState(
    localStorage.getItem("profileURL") || man
  )
  const [name, setName] = useState(localStorage.getItem("Name") || "")

  useEffect(() => {
    // initialize profile info
    localStorage.setItem("profileURL", man)
    localStorage.setItem("Name", "Novi Kristianti")
    setValue(man)
    setName("Novi Kristianti")
  }, [])

  const loginAuth = async e => {
    e.preventDefault()
    try {
      // call your Express /login endpoint
      const { data } = await api.post("/login", { email, password })

      // store JWT in localStorage
      localStorage.setItem("token", data.token)
      localStorage.setItem("login", "true")
      localStorage.setItem("role", data.user?.role)

      localStorage.setItem("Name", data.user.name)
      setValue(man)
      setName(data.user.name)

      toast.success("Successfully logged in!")
      // redirect to dashboard
      navigate(`${process.env.PUBLIC_URL}/dashboard/default/${layoutURL}`)
    } catch (err) {
      console.error(err)
      toast.error(
        err.response?.status === 401
          ? "Invalid email or password"
          : "Login failed"
      )
    }
  }

  return (
    <Fragment>
      <Container fluid className="p-0 login-page">
        <Row>
          <Col xs="12">
            <div className="login-card">
              <div className="login-main login-tab">
                <Form className="theme-form" onSubmit={loginAuth}>
                  <H4>
                    {selected === "simpleLogin"
                      ? ""
                      : "Welcome"}
                  </H4>
                  <P>Enter your email &amp; password to login</P>

                  {/* Email */}
                  <FormGroup>
                    <Label className="col-form-label">
                      {EmailAddress}
                    </Label>
                    <Input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </FormGroup>

                  {/* Password */}
                  <FormGroup className="position-relative">
                    <Label className="col-form-label">{Password}</Label>
                    <div className="position-relative">
                      <Input
                        type={togglePassword ? "text" : "password"}
                        className="form-control"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                      />
                      <div
                        className="show-hide"
                        onClick={() => setTogglePassword(!togglePassword)}
                      >
                        <span className={togglePassword ? "" : "show"}></span>
                      </div>
                    </div>
                  </FormGroup>

                  {/* Remember & Forgot */}
                  <div className="position-relative form-group mb-0">
                    <div className="checkbox">
                      <Input id="checkbox1" type="checkbox" />
                      <Label className="text-muted" for="checkbox1">
                        {RememberPassword}
                      </Label>
                    </div>
                    <a className="link" href="#javascript">
                      {ForgotPassword}
                    </a>
                    <Btn
                      attrBtn={{
                        color: "primary",
                        className: "d-block w-100 mt-2",
                        type: "submit"
                      }}
                    >
                      {SignIn}
                    </Btn>
                  </div>

                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <ToastContainer />
    </Fragment>
  )
}

export default Signin
