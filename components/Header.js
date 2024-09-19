import React from 'react';
import { Image } from 'react-bootstrap';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="header">
      <Link href="/" passHref>
        <div>
          <Image
            src="/letsEatLogo.png"
            alt="Let's Eat Logo"
            width={500}
            height={400}
            style={{ objectFit: 'contain', cursor: 'pointer' }}
          />
        </div>
      </Link>
    </header>
  );
}
