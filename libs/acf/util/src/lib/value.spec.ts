import { Value } from './value';

describe('getValue', () => {
  it('should return the original value if it does not match any patterns', async () => {
    const result = await Value.getValue('simpleValue');
    expect(result).toBe('simpleValue');
  });

  it('should handle RANDOM pattern correctly', async () => {
    const result = await Value.getValue('<random[a-zA-Z]{5}>');
    expect(result).toMatch(/[a-zA-Z]{5}/);
  });

  it('should handle RANDOM pattern correctly', async () => {
    const query = '<random[김이박최강오임]{1}>';
    const result = await Value.getValue(query);
    expect(result).toBeDefined();
  });

  it('should replace <batchRepeat> with the correct value', async () => {
    window.__batchRepeat = 5;
    const result = await Value.getValue('<batchRepeat>');
    expect(result).toBe('5');
  });

  it('should replace <actionRepeat> with the correct value', async () => {
    window.__actionRepeat = 3;
    const result = await Value.getValue('<actionRepeat>');
    expect(result).toBe('3');
  });

  it('should replace <sessionCount> with the correct value', async () => {
    window.__sessionCount = 10;
    const result = await Value.getValue('<sessionCount>');
    expect(result).toBe('10');
  });

  it('should handle multiple QUERY patterns correctly', async () => {
    const searchParams = new URLSearchParams();
    searchParams.set('param1', 'value1');
    searchParams.set('param2', 'value2');
    const originalSearch = window.location.search;
    window.history.replaceState({}, '', `${window.location.pathname}?${searchParams.toString()}`);

    const result = await Value.getValue('<query::param1> and <query::param2>');
    expect(result).toBe('value1 and value2');

    window.history.replaceState({}, '', `${window.location.pathname}${originalSearch}`);
  });

  it('should handle multiple QUERY patterns correctly with sanitization and validation', async () => {
    const searchParams = new URLSearchParams();
    searchParams.set('param1', 'value1');
    searchParams.set('param2', 'value2<script>alert(1)</script>');
    const originalSearch = window.location.search;
    window.history.replaceState({}, '', `${window.location.pathname}?${searchParams.toString()}`);

    const result = await Value.getValue('<query::param1> and <query::param2>');
    expect(result).toBe('value1 and param2');

    window.history.replaceState({}, '', `${window.location.pathname}${originalSearch}`);
  });
});
