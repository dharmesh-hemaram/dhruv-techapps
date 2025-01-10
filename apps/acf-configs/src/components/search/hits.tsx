import { Hit as AlgoliaHit } from 'instantsearch.js';
import { Highlight } from 'react-instantsearch';
import { Link } from 'react-router-dom';

type HitProps = {
  hit: AlgoliaHit<{
    name: string;
    url: string;
    price: number;
  }>;
};

export const Hit = ({ hit }: HitProps) => {
  return (
    <Link
      className='d-flex p-4 w-100 flex-column'
      to={{
        pathname: `/config/${hit.objectID}`,
        search: `?queryID=${hit.__queryID}`,
      }}
    >
      <article className='d-flex'>
        <img src={`https://www.google.com/s2/favicons?sz=64&domain_url=${hit.url.split('/')[2]}`} alt={hit.name} width={'64px'} />
        <div>
          <h4 className='Hit-label'>
            <Highlight attribute='name' hit={hit} />
          </h4>
          <p className='Hit-price'>
            <Highlight attribute='url' hit={hit} />
          </p>
        </div>
      </article>
    </Link>
  );
};
