import React, { useState } from 'react';
import ProfileInfo from '../Cards/ProfileInfo.jsx'; // Verify this path
import { useNavigate } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';

const Navbar = ({ userInfo, onSearchNote, handleClearSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery);
    }
  };

  const onClearSearch = () => {
    setSearchQuery('');
    handleClearSearch(); // Ensure it calls the correct function
  };

  return (
    <div className="navc flex items-center justify-between px-6 py-2">
      <h2 className="logo">
        My<span className="spanN">Notes</span>
      </h2>
      <SearchBar
        value={searchQuery}
        onChange={({ target }) => {
          setSearchQuery(target.value);
        }}
        handleSearch={handleSearch} // Update function name here
        onClearSearch={onClearSearch}
      />
      <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
    </div>
  );
};

export default Navbar;
