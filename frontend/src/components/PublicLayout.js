import React from 'react';
import { Outlet } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <div className="relative min-h-screen bg-brand-bg">
      {/* Background Image Container */}
      <div 
        className="absolute inset-0 top-0 hidden md:block" // Скрываем на мобильных
        style={{
          backgroundImage: `url(/bg.png)`,
          backgroundSize: 'cover', // Можно использовать 'contain' если нужно вписать целиком
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          zIndex: 0,
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <Outlet />
      </div>
    </div>
  );
};

export default PublicLayout;