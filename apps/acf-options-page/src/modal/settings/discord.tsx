import { Discord, LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common';
import { StorageService } from '@dhruv-techapps/core-service';
import { DiscordOauthService } from '@dhruv-techapps/discord-oauth';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Badge, Button, Form, Image } from 'react-bootstrap';

function SettingDiscord({ onChange, label, checked }) {
  const [discord, setDiscord] = useState<Discord>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    StorageService.get<LOCAL_STORAGE_KEY.DISCORD, Discord>(LOCAL_STORAGE_KEY.DISCORD)
      .then(({ discord: result }) => {
        if (result) {
          setDiscord(result);
        }
      })
      .catch(setError);
  }, []);

  const connect = () => {
    DiscordOauthService.login()
      .then((response) => {
        if (response) {
          setDiscord(response);
        }
      })
      .catch(setError);
  };

  const remove = () => {
    DiscordOauthService.remove()
      .then(() => {
        setDiscord(undefined);
      })
      .catch(setError);
  };

  console.log(error?.name, error?.message, error?.stack);

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
    <div>
      <Button variant='link' onClick={connect} data-testid='discord-connect'>
        Connect with discord
      </Button>
      {error?.message && <Badge bg='danger'>{error?.message}</Badge>}
    </div>
  );
}

SettingDiscord.displayName = 'SettingDiscord';
SettingDiscord.propTypes = {
  checked: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
export { SettingDiscord };
