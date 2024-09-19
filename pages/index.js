// import React, { useState } from 'react';
import React from 'react';
import { Button, Image } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { signOut } from '../utils/auth';

function Home() {
  // const [value, setValue] = useState(0);
  const router = useRouter();
  const navigateTo = (path) => {
    router.push(path);
  };

  return (
    <div
      className="Button"
      style={{
        height: '90vh',
        padding: '30px',
        maxWidth: '400px',
        margin: '0 auto',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'relative', marginTop: '-100px' }}>
        <Image
          src="/Eco-no-bg-final.jpg"
          alt="ECO PRODUCTS Logo"
          style={{
            height: '400px',
            display: 'block',
            margin: '0 auto',
          }}
        />
      </div>
      <div style={{ marginTop: '-100px' }}>
        <h3>SELECT A CATEGORY</h3>
        <Button className="d-block w-100 mb-2" onClick={() => navigateTo('/BathProducts')}>Bath</Button>
        <Button className="d-block w-100 mb-2" onClick={() => navigateTo('/PetProducts')}>Pets</Button>
        <Button className="d-block w-100 mb-2" onClick={() => navigateTo('/KitchenProducts')}>Kitchen</Button>
        <Button className="d-block w-100 mb-2" onClick={() => navigateTo('/cart')}>View Cart</Button>
        <Button className="d-block w-100" onClick={signOut}>Sign Out</Button>
      </div>
    </div>
  );
}
export default Home;
