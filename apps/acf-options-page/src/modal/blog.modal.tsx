import { Alert, Button, Modal, ListGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Markdown from 'react-markdown';
import { useAppDispatch, useAppSelector } from '../hooks';
import { blogSelector, hideBlog } from '../store/blog/blog.slice';
import moment from 'moment';

const BlogModal = () => {
  const { t } = useTranslation();

  const { visible, release } = useAppSelector(blogSelector);
  const dispatch = useAppDispatch();
  const handleClose = () => dispatch(hideBlog());
  const onShow = () => {
    //:TODO
  };

  const convertLink = (body: string) => {
    const regex = /https:\/\/\S+/g;
    const convertedBody = body.replace(regex, (match) => {
      const lastSegment = match.split('/').pop();
      return `[${lastSegment}](${match})`;
    });
    return convertedBody;
  };

  return (
    <Modal show={visible} size='lg' onHide={handleClose} scrollable onShow={onShow} data-testid='blog-modal'>
      <Modal.Header>
        <Modal.Title as='h3'>{release?.name}</Modal.Title>
      </Modal.Header>
      {release ? (
        <Modal.Body style={{ overflow: 'auto', height: 'calc(100vh - 200px)' }}>
          <Markdown>{convertLink(release.body)}</Markdown>
          <h3 className='mt-3'>Assets</h3>
          <ListGroup as='ol'>
            {release.assets.map((asset) => (
              <ListGroup.Item as='li' className='d-flex justify-content-between align-items-start'>
                <div className='me-auto'>
                  <a href={asset.browser_download_url} target='_blank' rel='noreferrer'>
                    {asset.name}
                  </a>
                </div>
                <span>{moment(asset.created_at).fromNow()}</span>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
      ) : (
        <Alert>Blog content not found</Alert>
      )}
      <Modal.Footer className='justify-content-between'>
        <Button type='button' variant='outline-secondary px-5' onClick={handleClose}>
          {t('common.close')}
        </Button>
        <Button variant='outline-primary' href={release?.discussion_url} target='_blank' rel='noreferrer'>
          Join Discussion
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export { BlogModal };
