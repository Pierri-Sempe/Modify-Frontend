import './Home.css';
import React from 'react';
import LoginButton from '../components/LoginButton';
import GetStartedButton from '../components/GetStartedButton';

export default function Home() {
  return (
    <div className="home-container">
      <LoginButton />
      <main className="main-content">
        <h1 className="title">Moodify</h1>
        <p className="subtitle">
          Discover the perfect melody for every emotion and let the music speak for you
        </p>
        <GetStartedButton />
      </main>
    </div>
  );
}
