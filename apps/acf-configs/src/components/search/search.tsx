import { liteClient as algoliasearch } from 'algoliasearch/lite';
import 'instantsearch.css/themes/satellite.css';
import { useRef } from 'react';
import { Breadcrumb, Configure, Hits, HitsPerPage, InstantSearch, Pagination, SearchBox, SortBy } from 'react-instantsearch';
import { ConfigurationModal } from '../configurations/configuration-modal';
import { Hit } from './hit';

const searchClient = algoliasearch('73MWYYE2GK', '922d418699b5b6fc7c86e8acfcc060f9');

export const Search = () => {
  const ref = useRef(null);

  return (
    <main className='container-fluid'>
      <InstantSearch searchClient={searchClient} indexName='configurations' insights>
        <Configure hitsPerPage={5} ruleContexts={[]} />
        <div className='container mt-5'>
          <div className='row'>
            <div className='Search col'>
              <Breadcrumb attributes={['hierarchicalCategories.lvl0', 'hierarchicalCategories.lvl1', 'hierarchicalCategories.lvl2']} />
              <SearchBox placeholder='Search' autoFocus />

              <div className='d-flex justify-content-end'>
                <HitsPerPage
                  items={[
                    { label: '10 configurations per page', value: 10, default: true },
                    { label: '20 configurations per page', value: 20 },
                    { label: '40 configurations per page', value: 40 },
                  ]}
                />
                <SortBy items={[{ label: 'Relevance', value: 'instant_search' }]} />
              </div>

              <Hits hitComponent={Hit} />
              <Pagination className='Pagination' />
            </div>
          </div>
        </div>
      </InstantSearch>
      <ConfigurationModal />
    </main>
  );
};
