import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Card, CardBody, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import { H5, P, Image} from '../../../AbstractElements';
import { Link } from 'react-router-dom';
import { Password, Website, Save, EmailAddress } from '../../../Constant';
import CustomizerContext from '../../../_helper/Customizer';
import useUsers from '../../../Hooks/useUsers';

const MyProfile = () => {
  const { fetchMe } = useUsers()
  const { layoutURL } = useContext(CustomizerContext);
  const [me, setMe] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const user = await fetchMe();
        console.log(user)
        setMe(user);
      } catch (err) {
        console.error('Failed to fetch my profile:', err);
      }
    })();
  }, [fetchMe]);
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
                      <H5 attrH5={{ className: 'mb-1' }}>{me?.name}</H5>
                    </Link>
                    <P>{me?.role}</P>
                  </div>
                </div>
              </div>
            </Row>
            <FormGroup className='mb-3'>
              <Label className='form-label'>Badge No.</Label>
              <div>{me?.badge_number || '-'}</div>
            </FormGroup>
            <FormGroup className='mb-3'>
              <Label className='form-label'>Department</Label>
              <div>{me?.department || '-'}</div>
            </FormGroup>
            <FormGroup className='mb-3'>
              <Label className='form-label'>Email Address</Label>
              <div>{me?.department || '-'}</div>
            </FormGroup>
          </Form>
        </CardBody>
      </Card>
    </Fragment>
  );
};
export default MyProfile;
