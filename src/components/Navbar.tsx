"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

const Navbar: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('/api/verifyToken', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setIsAuthenticated(response.data.valid);
        } catch (error) {
          console.error('Error verifying token:', error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []); // Dependency array is empty to run only on component mount

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      setIsAuthenticated(false); // Update state immediately
      window.location.reload(); // Refresh the page to reflect changes
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="flex justify-between items-center bg-gray-800 text-white p-4">
      <div className="flex items-center space-x-4">
        <div className="text-xl font-bold">ChatApp</div>
        <ul className="flex space-x-4">
          <li>
            <Link href="/" passHref>
              <span className="hover:text-gray-300 cursor-pointer">Home</span>
            </Link>
          </li>
          <li>
            <Link href="/about" passHref>
              <span className="hover:text-gray-300 cursor-pointer">About</span>
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded-md"
          >
            Logout
          </button>
        ) : (
          <>
            <Link href="/login" passHref>
              <button className="bg-green-500 text-white py-2 px-4 rounded-md">
                Login
              </button>
            </Link>
            <Link href="/signup" passHref>
              <button className="bg-yellow-500 text-white py-2 px-4 rounded-md">
                Sign Up
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
