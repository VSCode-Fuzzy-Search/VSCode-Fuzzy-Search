/* eslint-disable @typescript-eslint/naming-convention */
import { EXTENSION_CONSTANT } from 'constant';
import { CSSProperties } from 'react';

interface SearchBarProps {
  placeholder: string;
  data: any[];
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, data }) => {
  return (
    <div className='search' style={searchStyles}>
      <div className='search-input' style={searchInputStyles}>
        <input className='search-bar' type='text' placeholder={placeholder} style={searchBarStyles} id={EXTENSION_CONSTANT.ELEMENT_IDS.SEARCH_INPUT}/>
      </div>
    </div>
  );
};

export default SearchBar;


const searchStyles: CSSProperties = {
  width: '100%',
  maxWidth: '400px', /* Adjust width as needed */
  margin: '0 auto'
};

const searchInputStyles: CSSProperties = {
  position: 'relative',
  width: '100%',
  display: 'flex'
};

const searchBarStyles: CSSProperties = {
  flex: 1, /* Take up remaining space */
  padding: '10px 40px 10px 10px', /* Adjust padding as needed */
  border: '1px solid #ccc',
  fontSize: '16px',
  backgroundColor: 'orange',
  borderWidth: 'none'
};


const searchIconStyles: CSSProperties = {
  height: '60px',
  width: '60px',
  backgroundColor: 'orange',
  display: 'grid',
  placeItems: 'center',
  borderWidth: 'none'
};




