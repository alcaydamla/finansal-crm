import React, { useEffect, useState } from 'react';
import { Form, InputNumber, Select, DatePicker, Button, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


interface Customer {
  customerId: number;
  firstName: string;
  lastName: string;
}

const AddTransactionForm: React.FC = () => {
  const [form] = Form.useForm();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const navigate = useNavigate();



  useEffect(() => {
    axios.get('http://localhost:5290/api/aCustomer')
      .then(res => setCustomers(res.data))
      .catch(err => console.error(err));
      
  }, []);

  const handleSubmit = (values: any) => {
    const data = {
      customerId: values.customerId,
      amount: values.amount,
      type: values.type,
      transactionDate: values.transactionDate.format('YYYY-MM-DD')
    };

    axios.post('http://localhost:5290/api/aTransaction', data)
      .then(() => {
        message.success('İşlem başarıyla eklendi!');
        form.resetFields();
        navigate('/transactions');
      })
      .catch(() => {
        message.error('İşlem eklenirken hata oluştu.');
      });
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item
        name="customerId"
        label="Müşteri"
        rules={[{ required: true, message: 'Müşteri seçin' }]}
      >
        <Select placeholder="Bir müşteri seçin">
          {customers.map(customer => (
            <Select.Option key={customer.customerId} value={customer.customerId}>
              {customer.firstName} {customer.lastName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="amount"
        label="Tutar"
        rules={[{ required: true, message: 'Tutar girin' }]}
      >
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="type"
        label="İşlem Türü"
        rules={[{ required: true, message: 'İşlem türünü seçin' }]}
      >
        <Select placeholder="Tür seçin">
          <Select.Option value="Debt">Debt</Select.Option>
          <Select.Option value="Payment">Payment</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="transactionDate"
        label="Tarih"
        rules={[{ required: true, message: 'Tarih girin' }]}
      >
        <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">İşlemi Kaydet</Button>
      </Form.Item>
    </Form>
  );
};

export default AddTransactionForm;
