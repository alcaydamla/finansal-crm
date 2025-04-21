import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, Tag, Input, Select } from 'antd';
import { useLocation, Link } from 'react-router-dom';
import { ColumnsType } from 'antd/es/table';
import saveAs from 'file-saver';
import * as XLSX from 'xlsx';
import { EyeOutlined } from '@ant-design/icons';
import { FileExcelOutlined } from '@ant-design/icons';

const { Search } = Input;

interface Customer {
  customerId: number;
  firstName: string;
  lastName: string;
  type: string;
  remainingDebt?: number;
  debtStatus?: string;
}

const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchText, setSearchText] = useState('');
  const location = useLocation();

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:5290/api/aCustomer'),
      axios.get('http://localhost:5290/api/aTransaction'),
    ]).then(([customerRes, transactionRes]) => {
      const customers = customerRes.data;
      const transactions = transactionRes.data;

      const enriched = customers.map((customer: Customer) => {
        const userTx = transactions.filter((t: any) => t.customerId === customer.customerId);
        const totalDebt = userTx.filter((t: any) => t.type === 'Debt').reduce((sum: number, t: any) => sum + t.amount, 0);
        const totalPayment = userTx.filter((t: any) => t.type === 'Payment').reduce((sum: number, t: any) => sum + t.amount, 0);
        const remainingDebt = totalDebt - totalPayment;
        const debtStatus = remainingDebt <= 0 ? '✔️ Ödendi' : '❗ Borçlu';

        return {
          ...customer,
          remainingDebt,
          debtStatus,
        };
      });

      setCustomers(enriched);
    });
  }, [location]);

  const exportCustomersToExcel = () => {
    const exportData = customers.map((customer) => ({
      ID: customer.customerId,
      Ad: customer.firstName,
      Soyad: customer.lastName,
      Tip: customer.type,
      'Kalan Borç': `${customer.remainingDebt?.toLocaleString()} ₺`,
      Durum: customer.debtStatus,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Musteriler');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const date = new Date().toISOString().slice(0, 10);
    saveAs(blob, `musteriler-${date}.xlsx`);
  };

  const filteredCustomers = customers.filter((customer) =>
    (customer.firstName + ' ' + customer.lastName).toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<Customer> = [
    {
      title: 'ID',
      dataIndex: 'customerId',
      key: 'customerId',
      sorter: (a, b) => a.customerId - b.customerId,
      defaultSortOrder: 'ascend',
    }, 
    {
      title: 'Ad',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Soyad',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Detay',
      key: 'detail',
      render: (_, record) => (
        <Link to={`/customer/${record.customerId}`}>
          <Button icon={<EyeOutlined />} type="link" />
        </Link>
      ),
    },
    {
      title: 'Kalan Borç',
      dataIndex: 'remainingDebt',
      key: 'remainingDebt',
      render: (amount: number) => (
        <span style={{ color: amount > 0 ? 'red' : 'green' }}>
          {amount.toLocaleString()} ₺
        </span>
      )
    },    
    {
      title: 'Tip',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => type 
    },    
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Search
        placeholder="Müşteri ara..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        enterButton
        style={{ width: 300, marginBottom: 16 }}
      />

      <h2 style={{ marginBottom: '16px' }}>📋 Müşteri Listesi</h2>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
      <Button
  type="default"
  icon={<FileExcelOutlined />}
  onClick={exportCustomersToExcel}
>
  Excel'e Aktar
</Button>
      </div>

      <Table
        dataSource={filteredCustomers}
        columns={columns}
        rowKey="customerId"
        bordered
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default CustomersPage;
