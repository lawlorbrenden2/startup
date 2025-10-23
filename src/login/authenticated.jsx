import React from 'react';
import { useNavigate }  from 'react-router-dom';

import Button from 'react-bootstrap/Button';

export function Authenticated(props) {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem('userName');
    props.onLogout();
  };

  return (
    <div>
      <div className='userNameDisplay'>Current User: {props.userName}</div>
        <div className='dropdown-row'>
          <Button className="btn btn-primary" variant='primary' onClick={() => navigate('/progress')}>
            Begin
          </Button>
          <Button className="btn btn-dark" variant='secondary' onClick={() => logout()}>
            Sign out
          </Button>
        </div>
    </div>
  );
}