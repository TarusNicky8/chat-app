import React from 'react';

const Navbar: React.FC = () => {
  // Placeholder for authentication status (replace with actual logic)
  const isAuthenticated = true; // Example: Replace with actual authentication logic

  return (
    <nav className="flex justify-between items-center bg-gray-800 text-white p-4">
      <div className="flex items-center space-x-4">
        {/* Application Title or Logo */}
        <div className="text-xl font-bold">ChatApp</div>

        {/* Navigation Links */}
        <ul className="flex space-x-4">
          <li>
            <a href="/" className="hover:text-gray-300">
              Home
            </a>
          </li>
          <li>
            <a href="/about" className="hover:text-gray-300">
              About
            </a>
          </li>
          {/* Add more navigation links as needed */}
        </ul>
      </div>

      <div>
        {/* Authentication Status */}
        {isAuthenticated ? (
          <button className="bg-blue-500 text-white py-2 px-4 rounded-md">
            Logout
          </button>
        ) : (
          <button className="bg-green-500 text-white py-2 px-4 rounded-md">
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
