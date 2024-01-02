import { useMemo } from 'react';
import { Button, Dropdown, Form, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import { CaretDown, CaretUp, REGEX, ThreeDots, Trash } from '../../../util';
import { ElementFinderPopover, ValuePopover } from '../../../popover';
import { DropdownToggle } from '../../../components';
import { useAppDispatch, useAppSelector } from '@apps/acf-options-page/src/hooks';
import {
  removeAction,
  reorderActions,
  selectedConfigSelector,
  updateAction,
  actionSelector,
  openActionAddonModalAPI,
  openActionStatementModalAPI,
  openActionSettingsModalAPI,
} from '@apps/acf-options-page/src/store/config';
import { useConfirmationModalContext } from '@apps/acf-options-page/src/_providers/confirm.provider';
import { Action } from '@dhruv-techapps/acf-common';
import { defaultColumn } from './editable-cell';

type ActionMeta = { dataType: string; list: string; pattern: string; required: boolean; width?: string };
const ActionTable = () => {
  const { t } = useTranslation();
  const { actions } = useAppSelector(selectedConfigSelector);
  const { columnVisibility } = useAppSelector(actionSelector);
  const dispatch = useAppDispatch();
  const modalContext = useConfirmationModalContext();

  const removeActionConfirm = async (rowIndex) => {
    const name = `#${+rowIndex + 1} - ${actions[rowIndex].name || actions[rowIndex].elementFinder || 'row'}`;
    const result = await modalContext.showConfirmation({
      title: t('confirm.action.remove.title'),
      message: t('confirm.action.remove.message', name),
      headerClass: 'text-danger',
    });
    result && dispatch(removeAction(Number(rowIndex)));
  };

  const columns = useMemo<ColumnDef<Action, ActionMeta>[]>(
    () => [
      {
        header: t('action.initWait'),
        accessorKey: 'initWait',
        size: 70,
        maxSize: 70,
        meta: {
          width: '100px',
          dataType: 'number',
          list: 'interval',
          pattern: REGEX.INTERVAL,
        },
      },
      {
        header: t('action.name'),
        minSize: 100,
        size: 150,
        maxSize: 200,
        accessorKey: 'name',
      },
      {
        header: () => (
          <>
            {t('action.elementFinder')} <small className='text-danger'>*</small> <ElementFinderPopover />
          </>
        ),
        minSize: 400,
        maxSize: 1000,
        accessorKey: 'elementFinder',
        meta: {
          list: 'elementFinder',
          required: true,
        },
      },
      {
        header: () => (
          <>
            {t('action.value')} <ValuePopover />
          </>
        ),
        minSize: 400,
        maxSize: 1000,
        accessorKey: 'value',
        meta: {
          list: 'value',
        },
      },
      {
        header: t('action.repeat'),
        accessorKey: 'repeat',
        size: 70,
        meta: {
          dataType: 'number',
          list: 'repeat',
          type: 'number',
          pattern: REGEX.NUMBER,
        },
      },
      {
        header: t('action.repeatInterval'),
        accessorKey: 'repeatInterval',
        size: 80,
        meta: {
          dataType: 'number',
          list: 'interval',
          pattern: REGEX.INTERVAL,
        },
      },
    ],
    [t]
  );

  const table = useReactTable<Action>({
    columns: columns,
    data: actions,
    defaultColumn,
    state: { columnVisibility },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // Provide our updateData function to our table meta
    meta: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updateData: (rowIndex: number, columnId: string, value: any) => {
        dispatch(updateAction({ index: rowIndex, name: columnId, value }));
      },
    },
  });

  const showAddon = (row) => {
    dispatch(openActionAddonModalAPI(Number(row.id)));
  };

  const showCondition = (row) => {
    dispatch(openActionStatementModalAPI(Number(row.id)));
  };

  const showSettings = (row) => {
    dispatch(openActionSettingsModalAPI(Number(row.id)));
  };

  const moveUp = (e, rowId) => {
    if (e.currentTarget.getAttribute('disabled') === null) {
      dispatch(reorderActions({ oldIndex: +rowId, newIndex: rowId - 1 }));
    }
  };

  const moveDown = (e, rowId) => {
    if (e.currentTarget.getAttribute('disabled') === null) {
      dispatch(reorderActions({ oldIndex: +rowId, newIndex: +rowId + 1 }));
    }
  };

  return (
    <Form>
      <Table id='actions' hover className='mb-0'>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              <th style={{ width: '30px' }}>&nbsp;</th>
              {headerGroup.headers.map((header) => (
                <th key={header.id} style={{ width: header.getSize() }}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
              <th style={{ width: '92px' }}>&nbsp;</th>
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, index) => (
            <tr key={row.id}>
              <td align='center'>
                <div className='d-flex flex-column align-items-center text-secondary'>
                  <CaretUp
                    width='20'
                    height='20'
                    onClick={(e) => moveUp(e, row.id)} //disabled={index === 0}
                  />
                  <CaretDown
                    width='20'
                    height='20'
                    onClick={(e) => moveDown(e, row.id)} //disabled={index === rows.length - 1}
                  />
                </div>
              </td>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
              <td align='center'>
                <Button
                  variant='link'
                  data-testid='action-remove'
                  onClick={() => {
                    removeActionConfirm(row.id);
                  }}
                  disabled={actions.length === 1}
                >
                  <Trash className={actions.length === 1 ? '' : 'text-danger'} />
                </Button>
                {actions[row.id].elementFinder && (
                  <Dropdown id='acton-dropdown-wrapper' className='d-inline-block'>
                    <Dropdown.Toggle as={DropdownToggle} id='action-dropdown' aria-label='Action more option'>
                      <ThreeDots width='24' height='24' />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item data-testid='action-addon' onClick={() => showAddon(row)}>
                        {t('action.addon')}
                      </Dropdown.Item>
                      <Dropdown.Item data-testid='action-settings' onClick={() => showSettings(row)}>
                        {t('action.settings')}
                      </Dropdown.Item>
                      {index !== 0 && (
                        <Dropdown.Item data-testid='action-statement' onClick={() => showCondition(row)}>
                          {t('modal.actionCondition.title')}
                        </Dropdown.Item>
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Form>
  );
};

export default ActionTable;
