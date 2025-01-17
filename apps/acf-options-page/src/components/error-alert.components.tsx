import { FC } from 'react';
import { Alert, Col, Container, Row } from 'react-bootstrap';

type ErrorAlertProps = {
  heading?: string;
  error?: string;
};

export const ErrorAlert: FC<ErrorAlertProps> = ({ heading = 'Error', error }) => {
  if (!error) {
    return null;
  }

  return (
    <Container className='d-flex align-items-center justify-content-center'>
      <Row>
        <Col>
          <Alert variant='danger'>
            <p className='m-0'>
              <strong className='me-2'>{heading}</strong>
              {error}
            </p>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};
