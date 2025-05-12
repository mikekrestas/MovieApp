import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  onSearch: (query: string, type: 'movie' | 'user') => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'movie' | 'user'>('movie');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query) {
      onSearch(query, searchType);
      navigate('/search');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
      <select
        value={searchType}
        onChange={e => setSearchType(e.target.value as 'movie' | 'user')}
        style={{ marginRight: 12, padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc', background: '#fff', color: '#333' }}
      >
        <option value="movie">Movies</option>
        <option value="user">Users</option>
      </select>
      <TextField
        variant="outlined"
        placeholder={searchType === 'movie' ? 'Search for a movie...' : 'Search for a user...'}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{ mr: 2 }}
      />
      <Button variant="contained" color="primary" onClick={handleSearch}>
        Search
      </Button>
    </Box>
  );
};

export default SearchBar;
