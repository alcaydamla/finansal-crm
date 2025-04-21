import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Card, Descriptions, Table } from 'antd';
import axios from 'axios';

interface Transaction {
  transactionId: number;
  amount: number;
  type: string;
  transactionDate: string; 
  status: number;
}

interface Customer {
  customerId: number;
  firstName: string;
  lastName: string;
  type: string;
}

const CustomerDetail: React.FC = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);


  useEffect(() => {
    axios.get(`http://localhost:5290/api/aCustomer/${id}`).then(res => setCustomer(res.data));
    axios.get(`http://localhost:5290/api/aTransaction/byCustomer/${id}`).then(res => {
      setTransactions(res.data);
      
      const latest = [...res.data]
        .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())[0];
  
      setLastTransaction(latest);
    });
  }, [id]);
  
  const totalDebt = transactions
    .filter(t => t.type.toLowerCase() === 'debt')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPayment = transactions
    .filter(t => t.type.toLowerCase() === 'payment')
    .reduce((sum, t) => sum + t.amount, 0);

  const remainingDebt = totalDebt - totalPayment;



  const latestPaymentDate = transactions
    .filter(t => t.type.toLowerCase() === 'payment')
    .map(t => new Date(t.transactionDate))
    .sort((a, b) => b.getTime() - a.getTime())[0]?.toLocaleDateString();

    const columns = [
        {
          title: 'Tarih',
          dataIndex: 'transactionDate',
          key: 'transactionDate',
          render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
          title: 'Tutar',
          dataIndex: 'amount',
          key: 'amount',
          render: (amount: number, record: Transaction) => (
            <span style={{ color: record.type === 'Debt' ? 'red' : 'green' }}>
              {record.type === 'Debt' ? '-' : '+'} {amount.toLocaleString()} ₺
            </span>
          )
        },
        {
            title: 'Tarih',
            dataIndex: 'transactionDate',
            key: 'transactionDate',
            render: (date: string | number | Date) => new Date(date).toLocaleDateString('tr-TR'),
          },
          
        {
          title: 'Tip',
          dataIndex: 'type',
          key: 'type',
          render: (type: string) => type === 'Debt' ? 'Borç' : 'Ödeme',
        },
      ];
      

  return (
    <div style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Button onClick={() => window.print()} type="default">🖨 Yazdır</Button>
        </div>
       
      <Card title="Müşteri Detayı" bordered>
        {customer && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Ad">{customer.firstName}</Descriptions.Item>
            <Descriptions.Item label="Soyad">{customer.lastName}</Descriptions.Item>
            <Descriptions.Item label="Tip">{customer.type}</Descriptions.Item>
            <Descriptions.Item label="Toplam Borç">{totalDebt} ₺</Descriptions.Item>
            <Descriptions.Item label="Toplam Ödeme">{totalPayment} ₺</Descriptions.Item>
            <Descriptions.Item label="Kalan Borç">
              <span style={{ color: remainingDebt > 0 ? 'red' : 'green' }}>
                {remainingDebt > 0 ? `${remainingDebt} ₺` : 'Yok'}
              </span>
            </Descriptions.Item>

            <Descriptions.Item label="Son Ödeme Tarihi">{latestPaymentDate || 'Yok'}</Descriptions.Item>
 



          </Descriptions>
        )}
      </Card>

      <Card title="İşlem Geçmişi" style={{ marginTop: 24 }}>
        <Table dataSource={transactions} columns={columns} rowKey="transactionId" />
      </Card>
    </div>
  );
};

export default CustomerDetail;
