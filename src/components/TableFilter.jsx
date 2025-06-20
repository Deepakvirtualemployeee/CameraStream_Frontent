// components/TableFilter.jsx
import React from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import SearchIcon from '../assets/images/icons/search.svg';
import ReloadIcon from '../assets/images/icons/reload.svg';
import FilterIcon from '../assets/images/icons/filter.svg';

const TableFilter = ({ searchText, setSearchText, filters = [], onReset }) => {
    return (
        <div className="filter-wrapper d-flex flex-column flex-sm-row flex-wrap gap-2 mb-3">
            {/* Search input */}
            <InputGroup>
                <InputGroup.Text id="basic-addon1"><img src={SearchIcon} alt="Search Icon" /></InputGroup.Text>
                <Form.Control type="search" value={searchText} placeholder="Search..." onChange={e => setSearchText(e.target.value)} style={{ minWidth: '300px' }} />
            </InputGroup>

            {/* Custom filter selects */}
            {filters.map((filter, idx) => (
                <Form.Group key={idx}>
                    <Form.Select value={filter.value} onChange={e => filter.setValue(e.target.value)} style={{ minWidth: '200px' }} required >
                        <option value="" hidden>{filter.placeholder}</option>
                        {filter.options.map((opt, i) => (
                            <option key={i} value={opt}>{opt}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
            ))}

            {/* Reset button */}
            <Button className="text-secondary bg-primary bg-opacity-10 border d-flex align-items-center justify-content-center px-3" title="Reset Filters" onClick={onReset} >
                <i className="bi bi-arrow-clockwise fs-18"></i> <span className="ms-1 d-sm-none">Refresh</span>
            </Button>
        </div>
    );
};

export default TableFilter;
