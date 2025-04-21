import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UpdateTransactionModal from './UpdateTransactionModal';
import { Table, Button, Popconfirm, Space, message } from 'antd';
import { EditOutlined, DeleteOutlined, FileExcelOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface Transaction {
  customerId: any;
  transactionId: number;
  amount: number;
  type: string;
  status: number;
  firstName?: string; // frontend tarafından eklenecek
  lastName?: string;  // frontend tarafından eklenecek
}

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('http://localhost:5290/api/aTransaction');
      setTransactions(res.data);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    }
  };

  

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(transactions);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
  
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, 'transactions.xlsx');
  };
  
  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:5290/api/aTransaction'),
      axios.get('http://localhost:5290/api/aCustomer')
    ])
      .then(([txRes, customerRes]) => {
        const enriched = txRes.data.map((tx: Transaction) => {
          const customer = customerRes.data.find((c: any) => c.customerId === tx.customerId);
          return {
            ...tx,
            firstName: customer?.firstName || '',
            lastName: customer?.lastName || '',
          };
        });
        setTransactions(enriched);
      })
      .catch((err) => console.error('Veri çekme hatası:', err));
  }, []);
  

  const handleUpdate = (record: Transaction) => {
    setSelectedTransaction(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5290/api/aTransaction/delete/${id}`);
      message.success('İşlem silindi');
      await fetchTransactions();
    } catch (error) {
      message.error('Silme başarısız oldu');
    }
  };

  const columns: ColumnsType<Transaction> = [ 
    {
      title: 'ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
      sorter: (a, b) => a.transactionId - b.transactionId,
      defaultSortOrder: 'ascend',
    },
    {
      title: 'Ad Soyad',
      key: 'fullName',
      render: (record: any) => `${record.firstName} ${record.lastName}`,
    },    
    {
      title: 'Tutar (₺)',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <span style={{ color: amount >= 5000 ? 'green' : undefined }}>{amount.toLocaleString()} ₺</span>
      ),
    },
    
    {
      title: 'Tür',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: 'Borç', value: 'Debt' },
        { text: 'Ödeme', value: 'Payment' },
      ],
      onFilter: (value, record) => record.type === value,
      render: (type: string) => (
        <span style={{ color: type === 'Debt' ? 'red' : 'blue' }}>
          {type === 'Debt' ? 'Borç' : 'Ödeme'}
        </span>
      ),
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (_: any, record: Transaction) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleUpdate(record)}
          />
          <Popconfirm
            title="Silmek istediğinize emin misiniz?"
            onConfirm={() => handleDelete(record.transactionId)}
            okText="Evet"
            cancelText="Hayır"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>📄 İşlem Listesi</h2>
  
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
      <Button
  type="default"
  icon={<FileExcelOutlined />}
  onClick={exportToExcel}
>
  Excel'e Aktar
</Button>
      </div>
  
      <Table 
        scroll={{ x: 'max-content' }}
        dataSource={transactions}
        columns={columns}
        rowKey="transactionId"
        bordered
        pagination={{ pageSize: 10 }}
      />
  
      {selectedTransaction && (
        <UpdateTransactionModal
          visible={isModalVisible}
          transaction={selectedTransaction}
          onCancel={() => {
            setIsModalVisible(false);
            setSelectedTransaction(null);
            fetchTransactions();
          }}
        />
      )}
    </div>
  );
}
export default TransactionsPage;
