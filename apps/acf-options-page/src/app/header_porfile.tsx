import { NavDropdown } from 'react-bootstrap';
import { useConfirmationModalContext } from '../_providers/confirm.provider';
import { useAppDispatch, useAppSelector } from '../hooks';
import { firebaseFirestoreSelector, profileSetAPI } from '../store/firebase';
import { LockFill, UnLockFill } from '../util';

export const HeaderProfile = () => {
  const dispatch = useAppDispatch();
  const modalContext = useConfirmationModalContext();
  const { profile } = useAppSelector(firebaseFirestoreSelector);

  const onSwitchProfile = async () => {
    const result = await modalContext.showConfirmation({
      title: `Confirm profile switch to ${profile ? 'Private' : 'Public'}`,
      message: (
        <div>
          {profile ? (
            <ul className='text-start'>
              <li>By switching your profile to private, you will have limited access to cloud services (google sheets). </li>
              <li>We will also stop syncing your configurations to our server. </li>
            </ul>
          ) : (
            <>
              <ul className='text-start'>
                <li>By switching your profile to public, you will gain unlimited access to cloud services (google sheets). </li>
                <li>We will also sync your configurations to our server to help train our AI services and make your configurations searchable and usable for other users. </li>
              </ul>
              <i>Rest assured, all data will be encrypted before syncing to ensure your privacy and security.</i>
            </>
          )}
        </div>
      ),
      headerClass: 'text-danger',
    });
    result && dispatch(profileSetAPI(!profile));
  };

  return (
    <>
      <NavDropdown.Item title='profile' onClick={onSwitchProfile}>
        {profile ? <LockFill /> : <UnLockFill />} Switch to {profile ? 'Private' : 'Public'}
      </NavDropdown.Item>
      <NavDropdown.Divider />
    </>
  );
};
