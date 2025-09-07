import React, { Fragment, useContext } from 'react';
import { Card, CardBody, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import { H5, P, Image} from '../../../AbstractElements';
import { Link } from 'react-router-dom';
import { Password, Website, Save, EmailAddress } from '../../../Constant';
import CustomizerContext from '../../../_helper/Customizer';

const MyProfile = () => {
  const { layoutURL } = useContext(CustomizerContext);
  return (
    <Fragment>
      <Card>
<CardBody>
          <Form>
            <Row className='mb-2'>
              <div className='profile-title'>
                <div className='media'>
                  <Image attrImage={{ className: 'img-70 m-0 rounded-circle', alt: '', src: `${require('../../../assets/images/user/7.jpg')}` }} />
                  <div className='media-body'>
                    <Link to={`${process.env.PUBLIC_URL}/app/users/userProfile/${layoutURL}`}>
                      <H5 attrH5={{ className: 'mb-1' }}>NOVI KRISTIANTI</H5>
                    </Link>
                    <P>STAFF</P>
                  </div>
                </div>
              </div>
            </Row>
            <FormGroup className='mb-3'>
              <Label className='form-label'>Badge No.</Label>
              <div>123456</div>
            </FormGroup>
            <FormGroup className='mb-3'>
              <Label className='form-label'>Department</Label>
              <div>Sales</div>
            </FormGroup>
            <FormGroup className='mb-3'>
              <Label className='form-label'>Email Address</Label>
              <div>nkb-novi.k@nissinjpn.co.jp</div>
            </FormGroup>
          </Form>
        </CardBody>
      </Card>
    </Fragment>
  );
};
export default MyProfile;
