import type { Hit as BasHit } from 'instantsearch.js';
import { Highlight, useHits } from 'react-instantsearch';
import { useNavigate } from 'react-router-dom';

type HitProps = {
  hit: BasHit;
};

export const Hit = ({ hit }: HitProps) => {
  return (
    <article className='d-flex p-4 w-100 flex-column'>
      <b className='hit-name'>
        <Highlight attribute='name' hit={hit} />
      </b>
      <div className='hit-url'>
        <Highlight attribute='url' hit={hit} />
      </div>
    </article>
  );
};

export const CustomHits = () => {
  const { items } = useHits();

  const navigate = useNavigate();
  const onConfigClick = (hit: BasHit) => {
    navigate(`/config/${hit.objectID}`);
  };

  return (
    <div className='ais-Hits'>
      <ol className='ais-Hits-list'>
        {items.map((hit) => {
          return (
            <li className='ais-Hits-item' key={hit.objectID} onClick={() => onConfigClick(hit)}>
              <Hit hit={hit} />
            </li>
          );
        })}
      </ol>
    </div>
  );
};
