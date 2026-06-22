import { Search } from 'lucide-react';

const SearchBar = () => {
  return (
    <div style={{ position: 'relative', width: '250px' }}>
      {/* The Icon */}
      <div style={{
        position: 'absolute',
        left: '15px',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        alignItems: 'center',
        pointerEvents: 'none' // Makes sure clicking the icon focuses the input
      }}>
        <Search size={18} color="#94a3b8" />
      </div>

      <input 
        className='rounded-full text-gray-500'
        type="text"
        placeholder="Search"
        style={{
          width: '100%',
          padding: '10px 12px 10px 40px', // 40px left padding to clear the icon
          
          border: '1px solid #e2e8f0',
          fontSize: '16px',
          outline: 'none'
        }}
      />
    </div>
  );
};

export default SearchBar;