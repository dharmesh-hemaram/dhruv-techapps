import { useEffect, useState } from 'react';
import { StorageService } from '@dhruv-techapps/core-service';
import { Button, Form, Image } from 'react-bootstrap';
import { Discord, LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common';
import PropTypes from 'prop-types';
import { DiscordOauthService } from '@dhruv-techapps/acf-service';
import { RESPONSE_CODE } from '@dhruv-techapps/core-common';

function SettingDiscord({ onChange, label, checked }) {
  const [discord, setDiscord] = useState<Discord>();

  useEffect(() => {
    StorageService.get<LOCAL_STORAGE_KEY.DISCORD, Discord>(window.EXTENSION_ID, LOCAL_STORAGE_KEY.DISCORD)
      .then(({ discord: result }) => {
        if (result) {
          setDiscord(result);
        }
      })
      .catch(console.error);
  }, []);

  const connect = async () => {
    const response = await DiscordOauthService.login(window.EXTENSION_ID);
    if (response !== undefined && response !== RESPONSE_CODE.ERROR) {
      setDiscord(response);
    }
  };

  const remove = async () => {
    const response = await DiscordOauthService.remove(window.EXTENSION_ID);
    if (response === RESPONSE_CODE.REMOVED) {
      setDiscord(undefined);
    }
  };

  if (discord) {
    return (
      <div className='w-100'>
        <div className='d-flex justify-content-between align-items-center'>
          <Form.Label className='ms-2 mt-2 me-auto' htmlFor='discord'>
            <div className='fw-bold mb-2'>{label}</div>
            <Image
              alt={discord.displayName}
              className='me-2'
              title={discord.displayName}
              src={`https://cdn.discordapp.com/avatars/${discord.id}/${discord.avatar}.png`}
              roundedCircle
              width='30'
              height='30'
            />
            {discord.username}
            <Button variant='link' onClick={remove}>
              (remove)
            </Button>
          </Form.Label>
          <Form.Check type='switch' id='discord' onChange={onChange} checked={checked || false} name='discord' data-testid='discord-switch' />
        </div>
      </div>
    );
  }

  return (
    <Button variant='link' onClick={connect} data-testid='discord-connect'>
      Connect with discord
    </Button>
  );
}

SettingDiscord.displayName = 'SettingDiscord';
SettingDiscord.propTypes = {
  checked: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
export { SettingDiscord };
