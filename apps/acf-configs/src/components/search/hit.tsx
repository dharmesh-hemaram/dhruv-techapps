import { Highlight } from 'react-instantsearch';
import { useNavigate } from 'react-router-dom';

export const Hit = ({ hit }: { hit: any }) => {
  const navigate = useNavigate();
  const onConfigClick = () => {
    navigate(`/config/${hit.objectID}/${hit.userId}`);
  };
  return (
    <article onClick={onConfigClick}>
      <div className='hit-name'>
        <Highlight attribute='name' hit={hit} />
      </div>
      <div className='hit-url'>
        <Highlight attribute='url' hit={hit} />
      </div>
    </article>
  );
};
