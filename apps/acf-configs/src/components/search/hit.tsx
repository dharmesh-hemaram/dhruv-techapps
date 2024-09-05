import { Highlight } from 'react-instantsearch';
import { useNavigate } from 'react-router-dom';

export const Hit = ({ hit }: { hit: any }) => {
  const navigate = useNavigate();
  const onConfigClick = () => {
    navigate(`/config/${hit.objectID}`);
  };
  return (
    <article onClick={onConfigClick}>
      <b className='hit-name'>
        <Highlight attribute='name' hit={hit} />
      </b>
      <div className='hit-url'>
        <Highlight attribute='url' hit={hit} />
      </div>
    </article>
  );
};
