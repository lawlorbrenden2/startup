import React from 'react';

import { Unauthenticated } from './unauthenticated';
import { Authenticated } from './authenticated';
import { AuthState } from './authState';

export function Login({ userName, authState, onAuthChange }) {
  const [quote, setQuote] = React.useState("");
  const [quoteAuthor, setQuoteAuthor] = React.useState("");


  React.useEffect(() => {
    if (authState === AuthState.Authenticated) {
      fetch('https://quoteslate.vercel.app/api/quotes/random')
        .then(res => {
          console.log('quote API status:', res.status);
          return res.json();
        })
        .then(data => {
          console.log('quote API data:', data);
          setQuote(data.quote);
          setQuoteAuthor(data.author);
        })
        .catch((error) => {
          console.error('Could not fetch quote:', error);
          setQuote("Keep pushing forward!");
          setQuoteAuthor("");
        });
    }
  }, [authState]);



  return (
    <main className="container-fluid bg-dark text-light d-flex flex-column align-items-center justify-content-center auth-form">
      <div>
        {authState === AuthState.Unauthenticated && <h1>Welcome</h1>}
        {authState === AuthState.Authenticated && (
          <>
            <p className="text small mb-1">{quote}</p>
            <p className="text-secondary small">- {quoteAuthor}</p>
          </>
        )}
      </div>
      <div>
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