"use client"

import React, { useState, useEffect } from 'react';
import styles from './table.module.css';

const Table = ({ data, shouldReset, tableHeaders, onEdit, onDelete, onPreview }) => {
  const [sortedData, setSortedData] = useState(data);
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortedCategory, setSortedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSearchCategory, setSelectedSearchCategory] = useState(tableHeaders[0].category);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Function to reset the Table
  const resetTableState = () => {
    setSortedData(data);
    setSortOrder('asc');
    setSortedCategory(null);
    setSearchTerm('');
    setSelectedSearchCategory(tableHeaders[0].category);
    setCurrentPage(1);
  };

  // Resets Table when required
  useEffect(() => {
    if (shouldReset) {
      resetTableState();
    }
  }, [shouldReset]);

  // Updates data when input is updated
  useEffect(() => { 
    setSortedData(data);
  }, [data]);

  // Sends user back to the first page in case of changes
  useEffect(() => {
    setCurrentPage(1);
  }, [sortedCategory, sortOrder, searchTerm, selectedSearchCategory]);

  // Sorting
  const handleSort = (category) => {
    const newSortOrder = sortedCategory === category ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc';

    const sorted = [...sortedData].sort((a, b) => {
      if (newSortOrder === 'asc') {
        if (a[category] < b[category]) return -1;
        if (a[category] > b[category]) return 1;
      } else {
        if (a[category] < b[category]) return 1;
        if (a[category] > b[category]) return -1;
      }
      return 0;
    });

    setSortedData(sorted);
    setSortOrder(newSortOrder);
    setSortedCategory(category);
  };

  // Filtering
  const filteredData = sortedData.filter((dataSegment) => {
    const selectedCategoryValue = dataSegment[selectedSearchCategory];

    if (typeof selectedCategoryValue === 'string') {
      return selectedCategoryValue.toLowerCase().includes(searchTerm.toLowerCase());
    }

    return String(selectedCategoryValue).toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className={styles.container}>
      <div className={styles.search}>
        <input
          className={styles.input}
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className={styles.select}
          value={selectedSearchCategory}
          onChange={(e) => setSelectedSearchCategory(e.target.value)}
        >
          {tableHeaders.map((header, index) => (
            <option key={index} className={styles.option} value={header.category}>
              {header.label}
            </option>
          ))}
        </select>
      </div>
      <table className={styles.table}>
        <thead className={styles.head}>
          <tr className={styles.headContainer}>
            {tableHeaders.map((header, index) => (
              <th
                key={index}
                className={`${styles.headElement} ${
                  sortedCategory === header.category && sortOrder ? `sorted-${sortOrder}` : ''
                }`}
                onClick={() => handleSort(header.category)}
              >
                {header.label} {sortedCategory === header.category && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
            ))}
            {onEdit && <th className={`${styles.headElement} ${styles.headElementManagment}`}>Edit</th>}
            {onDelete && <th className={`${styles.headElement} ${styles.headElementManagment}`}>Delete</th>}
            {onPreview && <th className={`${styles.headElement} ${styles.headElementManagment}`}>Preview Image</th>}
          </tr>
        </thead>
        <tbody className={styles.body}>
          {currentItems.map((dataSegment, index) => (
            <tr key={index}>
              {tableHeaders.map((header, index) => (
                <td key={index} className={styles.bodyElement}>
                  {dataSegment[header.category]}
                </td>
              ))}
                {onEdit && <td className={styles.bodyElement}>
                  <button 
                    className={styles.manageButton}
                    onClick={() => onEdit(dataSegment)}>
                    Edit
                  </button>
                </td>}
                {onDelete && <td className={styles.bodyElement}>
                  <button 
                    className={styles.manageButton}
                    onClick={() => onDelete(dataSegment)}>
                    Delete
                  </button>
                </td>}
                {onPreview && <td className={styles.bodyElement}>
                  <button 
                    className={styles.manageButton}
                    onClick={() => onPreview(dataSegment)}>
                    Preview
                  </button>
                </td>}
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.pagination}>
        <button
          className={styles.button}
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          {"<"}
        </button>
        <span className={styles.span}>
          Page {currentPage} of {Math.ceil(filteredData.length / itemsPerPage)}
        </span>
        <button
          className={styles.button}
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={indexOfLastItem >= filteredData.length}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default Table;