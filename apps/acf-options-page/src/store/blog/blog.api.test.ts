import { blogCheckAPI } from './blog.api';

describe('blogCheckAPI', () => {
  it('should fetch blog content and return the parsed data', async () => {
    const version = '1.0.0';

    const result = await blogCheckAPI(version);

    expect(fetchMock).toHaveBeenCalledWith(`https://blog.getautoclicker.com/${version}/`);
    expect(result).toEqual(expectedData);
  });

  it('should throw an error if blog content is not found', async () => {
    const version = '1.0.0';

    fetchMock.mockResponseOnce('', { status: 404 });

    await expect(blogCheckAPI(version)).rejects.toThrow('Blog not found');
  });
});
