
import React from 'react';
import { X1Icon, MoonIcon, MessageIcon, UserIcon } from './icons';

interface HeaderProps {
  onLogoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  return (
    <header className="bg-gf-dark border-b border-gf-gray-700 sticky top-0 z-10">
      <div className="mx-auto max-w-screen-2xl px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <button onClick={onLogoClick} className="flex items-center space-x-2 focus:outline-none">
              <X1Icon className="h-6 w-6" />
              <span className="text-xl text-gf-gray-200">Finance</span>
            </button>
            <span className="bg-gf-gray-800 border border-gf-gray-600 text-gf-gray-300 text-xs font-semibold px-2 py-0.5 rounded">
              Beta
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full hover:bg-gf-gray-800">
              <MoonIcon className="h-6 w-6 text-gf-gray-300" />
            </button>
            <button className="p-2 rounded-full hover:bg-gf-gray-800">
              <MessageIcon className="h-6 w-6 text-gf-gray-300" />
            </button>
            <button className="p-1 rounded-full hover:ring-2 hover:ring-gf-blue">
              <UserIcon className="h-8 w-8" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
