import { useConfirmationModalContext } from '@apps/acf-options-page/src/_providers/confirm.provider';
import { useAppDispatch, useAppSelector } from '@apps/acf-options-page/src/hooks';
import { actionSelector, addAction, openActionAddonModalAPI, openActionSettingsModalAPI, openActionStatementModalAPI, removeAction, updateAction } from '@apps/acf-options-page/src/store/config';
import { Action } from '@dhruv-techapps/acf-common';
import { RANDOM_UUID } from '@dhruv-techapps/core-common';
import { ColumnDef, Row, flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo } from 'react';
import { Button, Dropdown, Form, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { DropdownToggle } from '../../../components';
import { ElementFinderPopover, ValuePopover } from '../../../popover';
import { Plus, REGEX, ThreeDots, Trash } from '../../../util';
import { defaultColumn } from './editable-cell';

type ActionMeta = { dataType: string; list: string; pattern: string; required: boolean; width?: string };

type ActionProps = {
  actions: Action[];
};

const ActionTable = ({ actions }: ActionProps) => {
  const { t } = useTranslation();

  const { columnVisibility } = useAppSelector(actionSelector);
  const dispatch = useAppDispatch();
  const modalContext = useConfirmationModalContext();

  const removeActionConfirm = async (actionId: RANDOM_UUID, index: number) => {
    const action = actions.find((action) => action.id === actionId);
    if (!action) {
      return false;
    }

    if (Object.keys(action).length === 3 && action.elementFinder === '') {
      dispatch(removeAction(actionId));
      return;
    }

    const name = action.name || `#${index + 1}`;
    const result = await modalContext.showConfirmation({
      title: t('confirm.action.remove.title'),
      message: t('confirm.action.remove.message', { name }),
      headerClass: 'text-danger',
    });
    result && dispatch(removeAction(actionId));
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
      updateData: (selectedActionId: RANDOM_UUID, columnId: string, value: any) => {
        dispatch(updateAction({ selectedActionId, name: columnId, value }));
      },
      updateValueFieldTypes: (selectedActionId: RANDOM_UUID, valueFieldType: 'input' | 'textarea') => {
        dispatch(updateAction({ selectedActionId, name: 'valueFieldType', value: valueFieldType }));
      },
    },
  });

  const showAddon = (row: Row<Action>) => {
    dispatch(openActionAddonModalAPI(row.original.id));
  };

  const showCondition = (row: Row<Action>) => {
    dispatch(openActionStatementModalAPI(row.original.id));
  };

  const showSettings = (row: Row<Action>) => {
    dispatch(openActionSettingsModalAPI(row.original.id));
  };

  const onDisableClick = (row: Row<Action>, disabled: boolean) => {
    dispatch(updateAction({ selectedActionId: row.original.id, name: 'disabled', value: !disabled }));
  };

  const onAddClick = (row: Row<Action>, position: 1 | 0) => {
    dispatch(addAction({ actionId: row.original.id, position }));
  };

  return (
    <Form>
      <Table id='actions' hover className='mb-0'>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {/*<th style={{ width: '30px' }}>&nbsp;</th>*/}
              <th style={{ width: '22px' }}>#</th>
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
            <tr key={row.id} className={actions[row.id].disabled ? 'table-secondary' : ''}>
              <td className='align-middle'>{index + 1}</td>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
              <td align='center'>
                <Button
                  variant='link'
                  data-testid='action-remove'
                  onClick={() => {
                    removeActionConfirm(row.original.id, index);
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
                      <Dropdown.Divider />
                      <Dropdown.Item data-testid='action-add' onClick={() => onAddClick(row, 0)}>
                        <Plus className='me-2' /> {t('action.addBefore')}
                      </Dropdown.Item>
                      <Dropdown.Item data-testid='action-add' onClick={() => onAddClick(row, 1)}>
                        <Plus className='me-2' /> {t('action.addAfter')}
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item data-testid='action-disable' onClick={() => onDisableClick(row, actions[row.id].disabled)}>
                        {t(`action.${actions[row.id].disabled ? 'enable' : 'disable'}`)}
                      </Dropdown.Item>
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
