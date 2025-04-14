import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Table, Typography, Spin } from 'antd';

const { Title } = Typography;

interface Transaction {
  transactionId: number;
  amount: number;
  transactionDate: string;
  type: string;
}

const CustomerDebt: React.FC = () => {
  const { id } = useParams(); // URL'deki :id değerini alıyoruz
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5290/api/aTransaction/customer/${id}/debts`)
      .then((res) => {
        setTransactions(res.data);
      })
      .catch((err) => {
        console.error('Borçlar alınamadı:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
    },
    {
      title: 'Tutar',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Tarih',
      dataIndex: 'transactionDate',
      key: 'transactionDate',
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={3}>Müşteri Borçları</Title>
      {loading ? (
        <Spin />
      ) : (
        <Table
          dataSource={transactions}
          columns={columns}
          rowKey="transactionId"
        />
      )}
    </div>
  );
};

export default CustomerDebt;
