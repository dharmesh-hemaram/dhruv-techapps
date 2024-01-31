import { Alert, Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Markdown from 'react-markdown';
import { useAppDispatch, useAppSelector } from '../hooks';
import { blogSelector, hideBlog } from '../store/blog/blog.slice';

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

    let convertedBody = body.replace(regex, (match) => {
      const lastSegment = match.split('/').pop();
      return `[${lastSegment}](${match})`;
    });

    convertedBody = convertedBody.replace(`<!-- Release notes generated using configuration in .github/release.yml at ${release?.name} -->`, '');

    return convertedBody;
  };

  return (
    <Modal show={visible} size='lg' onHide={handleClose} scrollable onShow={onShow} data-testid='blog-modal'>
      <Modal.Header>
        <Modal.Title as='h3'>
          <a href={release?.html_url} target='_blank' rel='noreferrer'>
            {release?.name}
          </a>
        </Modal.Title>
      </Modal.Header>
      {release ? (
        <Modal.Body style={{ overflow: 'auto', height: 'calc(100vh - 200px)' }}>
          <Markdown>{convertLink(release.body)}</Markdown>
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
