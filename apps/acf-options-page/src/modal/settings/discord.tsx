import { useEffect } from 'react';
import { Button, Form, Image } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { firebaseSelector, switchFirebaseLoginModal } from '../../store/firebase';
import { settingsSelector } from '../../store/settings';
import { discordDeleteAPI, discordGetAPI, discordLoginAPI } from '../../store/settings/settings.api';

type SettingDiscordProps = {
  checked: boolean;
  label: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

function SettingDiscord({ onChange, label, checked }: SettingDiscordProps) {
  const { discord } = useAppSelector(settingsSelector);
  const { user } = useAppSelector(firebaseSelector);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user && !discord) {
      dispatch(discordGetAPI());
    }
  }, [user, discord, dispatch]);

  const connect = () => {
    dispatch(discordLoginAPI());
  };

  const remove = () => {
    dispatch(discordDeleteAPI());
  };

  if (!user) {
    return (
      <p>
        Please
        <Button variant='link' title='login' onClick={() => dispatch(switchFirebaseLoginModal())}>
          Login
        </Button>
        to your account before connecting with Discord.
      </p>
    );
  }

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
              (disconnect)
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

export { SettingDiscord };
