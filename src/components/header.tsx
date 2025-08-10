import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="text-2xl font-bold text-gray-800">
          <Link href="/">SLOA</Link>
        </div>
        <nav className="flex items-center space-x-4">
          <Link href="/login" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
