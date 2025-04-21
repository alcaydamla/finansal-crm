import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Table, Typography, Spin, Select } from 'antd';

const { Title, Paragraph } = Typography;
const { Option } = Select;

interface Transaction {
  customerId: number;
  transactionId: number;
  amount: number;
  transactionDate: string;
  type: string;
}

const CustomerTransactions: React.FC = () => {
  const { id } = useParams();
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<string>('All');
  const [customerName, setCustomerName] = useState('');


  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5290/api/aTransaction`)
      .then((res) => {
        const customerData = res.data.filter((t: Transaction) => t.customerId === Number(id));
        setAllTransactions(customerData);
        setFilteredTransactions(customerData);
      })
      .catch((err) => {
        console.error("Veri alınırken hata oluştu:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);


  useEffect(() => {
    axios.get(`http://localhost:5290/api/aCustomer/${id}`)
      .then((res) => {
        const customer = res.data;
        console.log("Müşteri verisi:", customer);
        setCustomerName(`${customer.firstName ?? ''} ${customer.lastName ?? ''}`);
      })
      .catch((err) => {
        console.error("Müşteri bilgisi alınırken hata oluştu:", err);
      });
  }, [id]);

  useEffect(() => {
    if (filterType === 'All') {
      setFilteredTransactions(allTransactions);
    } else {
      setFilteredTransactions(allTransactions.filter((t) => t.type === filterType));
    }
  }, [filterType, allTransactions]);

  
  const totalDebt = filteredTransactions
    .filter(t => t.type === 'Debt')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPayment = filteredTransactions
    .filter(t => t.type === 'Payment')
    .reduce((sum, t) => sum + t.amount, 0);

  const remainingBalance = totalDebt - totalPayment;

  const columns = [
    {
      title: 'Transaction ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
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
      render: (text: string) => (
        <span style={{ color: text === 'Debt' ? 'red' : 'green' }}>{text}</span>
      ),
    },
    {
      title: 'Tarih',
      dataIndex: 'transactionDate',
      key: 'transactionDate',
      render: (date: string) => new Date(date).toLocaleDateString('tr-TR'),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={3}>Müşteri İşlem Geçmişi: {customerName}</Title>

      <Select
        defaultValue="All"
        style={{ width: 200, marginBottom: 16 }}
        onChange={(value) => setFilterType(value)}
      >
        <Option value="All">Tümü</Option>
        <Option value="Debt">Borçlar</Option>
        <Option value="Payment">Ödemeler</Option>
      </Select>

      <Paragraph>
        <strong>Toplam Borç:</strong> {totalDebt.toLocaleString()} ₺<br />
        <strong>Toplam Ödeme:</strong> {totalPayment.toLocaleString()} ₺<br />
        <strong>Kalan Bakiye:</strong> {remainingBalance.toLocaleString()} ₺
      </Paragraph>

      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          dataSource={filteredTransactions}
          columns={columns}
          rowKey="transactionId"
        />
      )}
    </div>
  );
};

export default CustomerTransactions;
