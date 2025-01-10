import { liteClient as algoliasearch } from 'algoliasearch/lite';
import 'instantsearch.css/themes/satellite.css';
import { Breadcrumb, Configure, Hits, HitsPerPage, InstantSearch, Pagination, SearchBox, SortBy } from 'react-instantsearch';
import { Hit } from './hits';

const searchClient = algoliasearch(process.env.NX_PUBLIC_ALGOLIA_APP_ID ?? '', process.env.NX_PUBLIC_ALGOLIA_SEARCH_API_KEY ?? '');

export const Search = () => {
  return (
    <main className='container-fluid'>
      <InstantSearch searchClient={searchClient} indexName='configurations' insights routing>
        <Configure ruleContexts={[]} />
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
    </main>
  );
};
