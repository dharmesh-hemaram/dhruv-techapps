import { hideBlog, blogReducer } from './blog.slice';

describe('blogReducer', () => {
  it('should handle hideBlog', () => {
    const initialState = {
      visible: true,
      title: 'Test Title',
      content: 'Test Content',
    };

    const action = hideBlog();
    const newState = blogReducer(initialState, action);

    expect(newState.visible).toBe(false);
    expect(newState.title).toBeUndefined();
    expect(newState.content).toBeUndefined();
  });
});
