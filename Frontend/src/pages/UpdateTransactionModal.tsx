import React from 'react';
import { Modal, Form, Select, InputNumber, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

interface UpdateTransactionModalProps {
  visible: boolean;
  onCancel: () => void;
  transaction: {
    transactionId: number;
    type: string;
    amount: number;
  };
}

const UpdateTransactionModal: React.FC<UpdateTransactionModalProps> = ({
  visible,
  onCancel,
  transaction
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await axios.put('http://localhost:5290/api/aTransaction/update-status', {
        transactionId: transaction.transactionId,
        type: values.type,
        amount: values.amount
      });
      

      message.success('İşlem başarıyla güncellendi!');
      onCancel();
    } catch (error) {
      message.error('Güncelleme başarısız!');
    }
  };

  return (
    <Modal
      title="İşlem Güncelle"
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="Güncelle"
      cancelText="İptal"
    >
<Form
  form={form}
  layout="vertical"
  initialValues={{
    type: transaction?.type,
    amount: transaction?.amount,
  }}
>
  <Form.Item
    name="type"
    label="Transaction Type"
    rules={[{ required: true, message: 'Please select transaction type' }]}
  >
    <Select placeholder="Select transaction type">
      <Option value="Payment">Payment</Option>
      <Option value="Debt">Debt</Option>
    </Select>
  </Form.Item>

  <Form.Item
    name="amount"
    label="Amount (₺)"
    rules={[{ required: true, message: 'Please enter amount' }]}
  >
    <InputNumber
      min={0}
      precision={2}
      style={{ width: '100%' }}
      placeholder="Enter amount"
    />
  </Form.Item>
</Form>

    </Modal>
  );
};

export default UpdateTransactionModal;
