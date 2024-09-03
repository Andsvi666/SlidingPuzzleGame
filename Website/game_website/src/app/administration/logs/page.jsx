'use client'

import React, { useState, useEffect } from 'react';
import style from './page.module.css';
import Table from '@/components/table/Table';
import {getTableData} from '@/utils/databaseActions'
import cookie from 'js-cookie';

//Headers used to format a table
const tableHeaders = [
  { category: 'id', label: 'ID' },
  { category: 'logText', label: 'Log Message' },
  { category: 'user', label: 'User' },
  { category: 'type', label: 'Type' },
  { category: 'dateTime', label: 'Logged at' },
];

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [renderPage, setRenderPage] = useState(false);

  // Checks if correct user accesses the page
  useEffect(() => {
    const ck = cookie.get('currentUser');
    if (ck === undefined) {
      window.location.href = '/';
    } else if(ck[2] !== '3'){
      window.location.href = '/';
    } else {
      setRenderPage(true);
    }
  }, []);

  //Fetches data from database
  useEffect(() => {
    async function fetchLogs() {
      const data = await getTableData('server_logs', {
        user_profiles: true,
        log_types: true,});
      const formattedData = data.map((segment) => ({
        ...segment,
        dateTime: new Date(segment.dateTime).toLocaleString('lt-LT', {
          timeZone: 'UTC',
          hour12: false,
        }),
        user: segment.user_profiles?.username,
        type: segment.log_types?.logtype,
      }));
      const orderedEntries = formattedData.sort((a, b) => b.id - a.id);
      setLogs(orderedEntries);
    }
    fetchLogs();
  }, []);

  if (!renderPage) {
    return; 
  }

  return (
    <div className={style.container}>
      <h1 className={style.header}>Server Logs</h1>
      <Table
        data={logs}
        shouldReset={false}
        tableHeaders={tableHeaders}
        onEdit={false}
        onDelete={false}
        onPreview={false}
      />
    </div>
  );
};

export default Logs;