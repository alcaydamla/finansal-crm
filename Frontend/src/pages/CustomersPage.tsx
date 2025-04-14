import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from 'antd';
import { useLocation } from 'react-router-dom';


interface Customer {
  customerId: number;
  firstName: string;
  lastName: string;
  type: string;
}

const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const location = useLocation();

  useEffect(() => {
    axios.get('http://localhost:5290/api/aCustomer')
      .then((res) => setCustomers(res.data))
      .catch((err) => console.error(err));
  }, [location]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'customerId',
      key: 'id',
    },
    {
      title: 'Ad',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Soyad',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Tip',
      dataIndex: 'type',
      key: 'type',
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '16px' }}>📋 Müşteri Listesi</h2>
      <Table
        dataSource={customers}
        columns={columns}
        rowKey="customerId"
        bordered
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default CustomersPage;
