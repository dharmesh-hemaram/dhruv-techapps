import { getFieldNameValue } from '@apps/acf-options-page/src/util/element';
import { Action } from '@dhruv-techapps/acf-common';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useRef, useState } from 'react';
import { Button, Form, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';

export const defaultColumn: Partial<ColumnDef<Action>> = {
  cell: Cell,
};

function Cell({ getValue, row: { original }, column: { id, columnDef }, table }) {
  const { meta } = columnDef;
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const [isInvalid, setIsInvalid] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [valueFieldType, setValueFieldType] = useState<'input' | 'textarea'>(original.valueFieldType || 'input');

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

  const getInput = (as: 'input' | 'textarea') => (
    <Form.Control
      ref={inputRef}
      aria-label={meta?.ariaLabel}
      type={meta?.type}
      value={value || ''}
      name={id}
      as={as}
      {...(as === 'textarea' && { rows: 1 })}
      onChange={onChange}
      onBlur={onBlur}
      pattern={meta?.pattern}
      required={meta?.required}
      list={meta?.list}
      isInvalid={isInvalid}
      autoComplete='off'
    />
  );

  const onValueFieldTypeChange = () => {
    const newFieldType = valueFieldType === 'input' ? 'textarea' : 'input';
    setValueFieldType(newFieldType);
    table.options.meta?.updateValueFieldTypes(original.id, newFieldType);
  };

  if (id === 'value') {
    return (
      <InputGroup>
        <OverlayTrigger overlay={<Tooltip id={id}>{valueFieldType === 'input' ? `Switch to Textarea` : 'Switch to Input'}</Tooltip>}>
          <Button type='button' variant='outline-secondary' id='action-field-type' onClick={onValueFieldTypeChange}>
            {valueFieldType === 'input' ? 'I' : 'T'}
          </Button>
        </OverlayTrigger>
        {getInput(valueFieldType)}
      </InputGroup>
    );
  }
  return <>{getInput(meta?.as)}</>;
}
