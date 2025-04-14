import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from 'antd';
import { Link } from 'react-router-dom';

interface Transaction {
  transactionId: number;
  customerId: number;
  amount: number;
  type: string;
  transactionDate: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    axios.get('http://localhost:5290/api/aTransaction')
      .then((res) => setTransactions(res.data))
      .catch((err) => console.error(err));
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
    },
    {
      title: 'Müşteri ID',
      dataIndex: 'customerId',
      key: 'customerId',
      render: (id: number) => <Link to={`/borc/${id}`}>{id}</Link>,
    },
    {
      title: 'Tutar',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `${amount.toLocaleString()} ₺`,
    },
    {
      title: 'Tür',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Tarih',
      dataIndex: 'transactionDate',
      key: 'transactionDate',
      render: (date: string) => new Date(date).toLocaleDateString('tr-TR'),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '16px' }}>📄 İşlem Listesi</h2>
      <Table
        dataSource={transactions}
        columns={columns}
        rowKey="transactionId"
        bordered
        pagination={{ pageSize:10 }}/>
    </div>
  );
}