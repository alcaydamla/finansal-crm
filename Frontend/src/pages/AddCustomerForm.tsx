import React from 'react';
import { Form, Input, Button, Select, Card, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const { Option } = Select;

const AddCustomerForm: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = async (values: any) => {
    try {
      await axios.post('http://localhost:5290/api/aCustomer', values);
      message.success('Müşteri başarıyla eklendi!');
      form.resetFields();
      navigate('/customers');
    } catch (error) {
      console.error(error);
      message.error('Müşteri eklenirken bir hata oluştu.');
    }
  };

  return (
    <Card title="Yeni Müşteri Ekle" style={{ maxWidth: 600, margin: '40px auto' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ type: 'Bireysel' }}
      >
        <Form.Item
          label="Müşteri ID"
          name="customerId"
          rules={[{ required: true, message: 'Müşteri ID giriniz!' }]}
        >
          <Input type="number" placeholder="Örn: 101" />
        </Form.Item>

        <Form.Item
          label="Ad"
          name="firstName"
          rules={[{ required: true, message: 'Ad giriniz!' }]}
        >
          <Input placeholder="Örn: Ahmet" />
        </Form.Item>

        <Form.Item
          label="Soyad"
          name="lastName"
          rules={[{ required: true, message: 'Soyad giriniz!' }]}
        >
          <Input placeholder="Örn: Yılmaz" />
        </Form.Item>

        <Form.Item
          label="Müşteri Tipi"
          name="type"
          rules={[{ required: true, message: 'Müşteri tipi seçiniz!' }]}
        >
          <Select>
            <Option value="Bireysel">Bireysel</Option>
            <Option value="Kurumsal">Kurumsal</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Kaydet
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddCustomerForm;
