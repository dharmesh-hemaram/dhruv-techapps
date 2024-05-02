import { discordOauth } from './discord-oauth';

describe('discordOauth', () => {
  it('should work', () => {
    expect(discordOauth()).toEqual('discord-oauth');
  });
});
