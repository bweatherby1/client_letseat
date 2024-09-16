import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="header">
      <Link href="/" passHref>
        <Image src="/letsEatLogo.png" alt="Let's Eat Logo" width={480} height={160} layout="responsive" objectFit="contain" priority />
      </Link>
    </header>
  );
}
