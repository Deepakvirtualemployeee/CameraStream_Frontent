// components/TableFilter.jsx
import React from 'react';
import { Form, Button } from 'react-bootstrap';
import SearchIcon from '../assets/images/icons/search.svg';
import ReloadIcon from '../assets/images/icons/reload.svg';

const TableFilter = ({ searchText, setSearchText, searchPlaceholder = 'Search...', filters = [], onReset }) => {
    return (
        <div className="filter-wrapper d-flex flex-column flex-sm-row flex-wrap gap-2 flex-fill">
            {/* Search input */}
            <div className="searchfield-wrapper">
                <Form.Control type="search" value={searchText} placeholder={searchPlaceholder} onChange={e => setSearchText(e.target.value)} />
                <img src={SearchIcon} alt="Search Icon" className="icon" />
            </div>

            {/* Custom filter selects */}
            {filters.map((filter, idx) => (
                <Form.Group key={idx}>
                    <Form.Select value={filter.value} onChange={e => filter.setValue(e.target.value)} style={{ minWidth: '195px' }} required >
                        <option value="" hidden>{filter.placeholder}</option>
                        {filter.options.map((opt, i) => (
                            <option key={i} value={opt}>{opt}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
            ))}

            {/* Reset button */}
            <Button variant='white' className="bg-white border-gray d-flex align-items-center justify-content-center gap-1 lh-1" title="Reset Filters" onClick={onReset} >
                <img src={ReloadIcon} alt="Reload Icon" className="lh-1" /> <span className="ms-1 d-sm-none">Refresh</span>
            </Button>
        </div>
    );
};

export default TableFilter;
