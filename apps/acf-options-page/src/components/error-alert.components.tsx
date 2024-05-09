import PropTypes from 'prop-types';
import { Alert, Col, Container, Row } from 'react-bootstrap';

export function ErrorAlert({ heading = 'Error', error }) {
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
}
ErrorAlert.defaultProps = {
  heading: 'Error',
};
ErrorAlert.propTypes = {
  heading: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.shape({ message: PropTypes.string.isRequired }).isRequired, PropTypes.string.isRequired]),
};
