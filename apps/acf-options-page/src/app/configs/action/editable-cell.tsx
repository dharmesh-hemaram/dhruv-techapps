import { useEffect, useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import { ColumnDef } from '@tanstack/react-table';
import { Action } from '@dhruv-techapps/acf-common';
import { getFieldNameValue } from '@apps/acf-options-page/src/util/element';

export const defaultColumn: Partial<ColumnDef<Action>> = {
  cell: Cell,
};

function Cell({ getValue, row: { original }, column: { id, columnDef }, table }) {
  const { meta } = columnDef;
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const [isInvalid, setIsInvalid] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onBlur = (e) => {
    const update = getFieldNameValue(e, { [id]: initialValue });
    if (update) {
      table.options.meta?.updateData(original.id, update.name, update.value);
    }
  };

  const onChange = ({ currentTarget: { value: changeValue } }) => {
    setIsInvalid(false);
    setValue(changeValue);
  };

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setIsInvalid(original.error?.includes(id));
    setValue(initialValue);
  }, [initialValue, id, original.error]);

  return (
    <Form.Control
      ref={inputRef}
      aria-label={meta?.ariaLabel}
      type={meta?.type}
      value={value || ''}
      name={id}
      onChange={onChange}
      onBlur={onBlur}
      pattern={meta?.pattern}
      required={meta?.required}
      list={meta?.list}
      isInvalid={isInvalid}
      autoComplete='off'
    />
  );
}
