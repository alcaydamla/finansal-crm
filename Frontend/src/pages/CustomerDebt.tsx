import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Table, Typography } from 'antd';

const { Title } = Typography;

const CustomerDebt: React.FC = () => {
  const { id } = useParams();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5290/api/aCustomer/${id}/transactions`)
      .then(res => {
        // Sadece borç olanları filtrele
        const debts = res.data.filter((t: any) => t.type === 'Debt');
        setTransactions(debts);
      })
      .catch(err => console.error(err));
  }, [id]);

  const columns = [
    { title: 'ID', dataIndex: 'transactionId', key: 'transactionId' },
    { title: 'Tutar', dataIndex: 'amount', key: 'amount' },
    { title: 'Tarih', dataIndex: 'transactionDate', key: 'transactionDate' },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Title level={3}>Müşteri Borçları</Title>
      <Table dataSource={transactions} columns={columns} rowKey="transactionId" />
    </div>
  );
};

export default CustomerDebt;
