import React from 'react';
import { Card, Typography } from 'antd';
import AddTransactionForm from '../components/AddTransactionForm';

const { Title } = Typography;

const AddTransactionPage: React.FC = () => {
  return (
    <div style={{ padding: '30px' }}>
      <Card
        title={<Title level={3}>📌 Yeni İşlem Ekle</Title>}
        bordered={false}
        style={{ maxWidth: 600, margin: '40px auto' }}
      >
        <AddTransactionForm />
      </Card>
    </div>
  );
};

export default AddTransactionPage;
