import { liteClient as algoliasearch } from 'algoliasearch/lite';
import 'instantsearch.css/themes/satellite.css';
import { Breadcrumb, Configure, DynamicWidgets, HierarchicalMenu, Hits, HitsPerPage, InstantSearch, Pagination, RefinementList, SearchBox, SortBy } from 'react-instantsearch';
import { useQueryRules, UseQueryRulesProps } from 'react-instantsearch-core';
import { Hit } from './hit';

const searchClient = algoliasearch('73MWYYE2GK', '922d418699b5b6fc7c86e8acfcc060f9');

export function Panel({ children, header, footer }: { children: React.ReactNode; header?: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <div className='ais-Panel'>
      {header && <div className='ais-Panel-header'>{header}</div>}
      <div className='ais-Panel-body'>{children}</div>
      {footer && <div className='ais-Panel-footer'>{footer}</div>}
    </div>
  );
}

function cx(...classNames: Array<string | number | boolean | undefined | null>) {
  return classNames.filter(Boolean).join(' ');
}

export type QueryRuleCustomDataProps = Omit<React.ComponentProps<'div'>, 'children'> &
  Partial<Pick<UseQueryRulesProps, 'transformItems'>> & {
    children: (options: { items: any[] }) => React.ReactNode;
  };

export function QueryRuleCustomData(props: QueryRuleCustomDataProps) {
  const { items } = useQueryRules(props);
  console.log(items);
  return <div className={cx('ais-QueryRuleCustomData', props.className)}>{props.children({ items })}</div>;
}

export const Search = () => {
  return (
    <InstantSearch searchClient={searchClient} indexName='configurations' insights>
      <Configure hitsPerPage={5} ruleContexts={[]} />
      <div className='container mt-5'>
        <div className='row'>
          <div className='col-3'>
            <DynamicWidgets>
              <Panel header='Users'>
                <RefinementList attribute='userId' searchablePlaceholder='My Configs' />
              </Panel>
              <Panel header='Hierarchy'>
                <HierarchicalMenu attributes={['hierarchicalCategories.lvl0', 'hierarchicalCategories.lvl1', 'hierarchicalCategories.lvl2']} showMore={true} />
              </Panel>
            </DynamicWidgets>
          </div>
          <div className='Search col'>
            <Breadcrumb attributes={['hierarchicalCategories.lvl0', 'hierarchicalCategories.lvl1', 'hierarchicalCategories.lvl2']} />
            <SearchBox placeholder='Search' autoFocus />

            <div className='d-flex justify-content-end'>
              <HitsPerPage
                items={[
                  { label: '10 hits per page', value: 10, default: true },
                  { label: '20 hits per page', value: 20 },
                  { label: '40 hits per page', value: 40 },
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
  );
};
