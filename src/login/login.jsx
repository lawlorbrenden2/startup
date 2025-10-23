import React from 'react';

import { Unauthenticated } from './unauthenticated';
import { Authenticated } from './authenticated';
import { AuthState } from './authState';

export function Login({ userName, authState, onAuthChange }) {
  return (
    <main className="container-fluid bg-dark text-light d-flex flex-column align-items-center justify-content-center auth-form">
      <div>
        {authState === AuthState.Unauthenticated && <h1>Welcome</h1>}
        {authState === AuthState.Authenticated && <h3>Let's get to work.</h3>} {/* I'm thinking about randomizing the message displayed here when implementing the database */}
        {authState === AuthState.Authenticated && (
          <Authenticated userName={userName} onLogout={() => onAuthChange(userName, AuthState.Unauthenticated)} />
        )}
        {authState === AuthState.Unauthenticated && (
          <Unauthenticated
            userName={userName}
            onLogin={(loginUserName) => {
              onAuthChange(loginUserName, AuthState.Authenticated);
            }}
          />
        )}
      </div>
    </main>
  );
}