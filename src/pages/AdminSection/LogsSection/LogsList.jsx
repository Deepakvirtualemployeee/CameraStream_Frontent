import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Spinner, Alert } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import dataTableCustomStyles from '../../../assets/style/dataTableCustomStyles';
import { NoDataComponent } from '../../../components/NoDataComponent';
import TableFilter from '../../../components/TableFilter';
import { getDriversEventSummary } from '../../../store/actions/driverHOS';

export const LogsList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { companyId } = useParams();

    // Redux state
    const { driversSummary, loading, error } = useSelector((state) => state.driversHOS);

    useEffect(() => {
        if (companyId) dispatch(getDriversEventSummary(companyId));
    }, [dispatch, companyId]);

    // // Convert seconds → "X Hours" (for Last Sync style)
    // const formatSecondsToHoursText = (seconds) => {
    //     if (!seconds || isNaN(seconds)) return "0 Hours";

    //     const hours = Math.floor(seconds / 3600);
    //     return `${hours} Hour${hours !== 1 ? "s" : ""}`;
    // };

    // Convert seconds → "X seconds/minutes/hours ago"
    const formatSecondsToHoursText = (seconds) => {
        if (!seconds || isNaN(seconds)) return "0 seconds ago";

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hours > 0) {
            return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
        } else if (minutes > 0) {
            return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
        } else {
            return `${secs} second${secs !== 1 ? "s" : ""} ago`;
        }
    };

    // Columns
    const columns = useMemo(() => [
        {
            name: 'Driver',
            selector: (row) => row.driverName || 'N/A',
            sortable: true,
            minWidth: '150px',
        },
        // {
        //   name: 'Forms & Manner Errors',
        //   minWidth: '130px',
        //   cell: (row) => (
        //     <div className="d-flex flex-wrap align-items-center gap-1">
        //       <span className="text-danger">
        //         {row.manner_errors || '—'}
        //       </span>
        //     </div>
        //   ),
        // },
        {
            name: 'Forms & Manner Errors',
            minWidth: '250px',
            cell: (row) => {
                const errors = [];

                if (row.trailerShippingDocs === false) {
                    errors.push('Trailer shipping doc is missing');
                }

                if (row.certifiedRecordDate === false) {
                    errors.push('Certified record date is missing');
                }

                // If no errors found
                if (errors.length === 0) {
                    return <span className="text-success">No Errors</span>;
                }

                return (
                    <div className="d-flex flex-column gap-1">
                        {errors.map((err, i) => (
                            <span key={i} className="text-danger">
                                {err}
                            </span>
                        ))}
                    </div>
                );
            },
        },

        {
            name: 'Last Sync',
            minWidth: '100px',
            //   selector: (row) => row.last_sync || '—',
            selector: (row) => row.lastSync ? formatSecondsToHoursText(row.lastSync) : "—",

        },
    ], []);

    // Filter state
    const [searchText, setSearchText] = useState('');
    const [filterHOSViolation, setfilterHOSViolation] = useState('');
    const [filterFormMannerErrors, setFilterFormMannerErrors] = useState('');
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    const resetFilters = () => {
        setSearchText('');
        setfilterHOSViolation('');
        setFilterFormMannerErrors('');
        setDateRange([null, null]);
    };

    const filters = []; // currently unused but can be added back easily

    // ✅ Use real data from Redux
    const filteredData = useMemo(() => {
        if (!driversSummary?.length) return [];

        return driversSummary.filter((item) => {
            const matchesSearch = Object.values(item).some((val) =>
                val?.toString().toLowerCase().includes(searchText.toLowerCase())
            );

            const matchesHOSViolation =
                filterHOSViolation === 'All' ||
                filterHOSViolation === '' ||
                item.hos_violations === filterHOSViolation;

            const matchesFormMannerErrors =
                filterFormMannerErrors === 'All' ||
                filterFormMannerErrors === '' ||
                item.manner_errors === filterFormMannerErrors;

            return matchesSearch && matchesHOSViolation && matchesFormMannerErrors;
        });
    }, [driversSummary, searchText, filterHOSViolation, filterFormMannerErrors]);

    return (
        <div className="LogsList-page py-3">
            <div className="container-fluid">
                <div className="main-heading mb-3">
                    Logs ({driversSummary?.length || 0})
                </div>

                <div className="table-content-wrapper">
                    <div className="action-wrapper d-flex flex-column flex-sm-row flex-wrap align-items-sm-start justify-content-between gap-2 mb-4">
                        <TableFilter
                            searchText={searchText}
                            setSearchText={setSearchText}
                            searchPlaceholder="Search by Driver"
                            filters={filters}
                            startDate={startDate}
                            endDate={endDate}
                            setDateRange={setDateRange}
                            onReset={resetFilters}
                        />
                    </div>

                    {/* 🟢 Handle loading, error, and data */}
                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : error ? (
                        <Alert variant="danger" className="text-center">
                            {error}
                        </Alert>
                    ) : (
                        <div className="table-responsive table-custom-wrapper">
                            <DataTable
                                columns={columns}
                                data={filteredData}
                                pagination
                                highlightOnHover
                                responsive
                                customStyles={dataTableCustomStyles}
                                noDataComponent={<NoDataComponent />}
                                striped
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
