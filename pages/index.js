import React from 'react';
import { Button, Image } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useAuth } from '../utils/context/authContext';

function Home() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const navigateTo = (path) => {
    router.push(path);
  };

  if (!user) {
    return null; // or a loading indicator
  }

  return (
    <div
      className="Button"
      style={{
        height: '100vh',
        padding: '30px',
        maxWidth: '400px',
        margin: '0 auto',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'relative', marginTop: '200px' }}>
        {/* Ensure no ref is passed to Image */}
        <div>
          <Image
            src="/letsEatLogo.png"
            alt="ECO PRODUCTS Logo"
            style={{
              height: '400px',
              display: 'block',
              margin: '0 auto',
            }}
          />
        </div>
      </div>
      <div style={{ marginTop: '20px' }}>
        <h3>SELECT A CATEGORY</h3>
        <Button className="d-block w-100 mb-2" onClick={() => navigateTo('/Restaurants/MyPlaces')}>My Places</Button>
        <Button className="d-block w-100 mb-2" onClick={() => navigateTo('/Restaurants/SelectedRestaurants')}>Selected Restaurants</Button>
        <Button className="d-block w-100 mb-2" onClick={() => navigateTo('Restaurants/All')}>All restaurants</Button>
        <Button className="d-block w-100 mb-2" onClick={() => navigateTo('/Profile')}>Profile</Button>
        <Button className="d-block w-100" onClick={logout}>Sign Out</Button>
      </div>
    </div>
  );
}

Home.getLayout = (page) => page;

export default Home;
