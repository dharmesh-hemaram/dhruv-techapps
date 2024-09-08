import { Highlight, useHits } from 'react-instantsearch';

export const Hit = ({ hit }: { hit: any }) => {
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

export const CustomHits = ({ modalRef }: { modalRef: any }) => {
  const { items, results, banner, sendEvent } = useHits();

  //const navigate = useNavigate();
  const onConfigClick = (hit: any) => {
    console.log('hit', hit);

    modalRef.current.show(hit.objectID);
    //navigate(`/config/${hit.objectID}`);
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
