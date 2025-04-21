/* import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Table, Typography, Spin, message } from 'antd';

const { Title } = Typography;

interface Transaction {
  transactionId: number;
  amount: number;
  transactionDate: string;
  type: string;
}

const CustomerDebt: React.FC = () => {
  const { id } = useParams();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);

    axios
      .get(`http://localhost:5290/api/aTransaction/customer/${id}/debts`)
      .then((response) => {
        console.log("Gelen borçlar:", response.data);
        setTransactions(response.data);
      })
      .catch((error) => {
        console.error("Hata oluştu:", error);
        message.error("Veri alınırken bir hata oluştu.");
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
      render: (date: string) => new Date(date).toLocaleDateString('tr-TR'), // Türkçe tarih
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={3}>Müşteri Borçları</Title>
      {loading ? (
        <Spin size="large" />
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
 */