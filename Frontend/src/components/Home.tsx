import React, { useEffect, useState } from 'react';
import { Card, Typography, Button, Row, Col, Statistic } from 'antd';
import { Link } from 'react-router-dom';
import {
  UserOutlined,
  FileTextOutlined,
  PlusOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    axios
      .get('http://localhost:5290/api/aTransaction/dashboard-summary')
      .then((res) => setSummary(res.data))
      .catch((err) => console.error('Dashboard API error:', err));
  }, []);

  return (
    <div style={{ padding: '60px 20px' }}>
      <Row justify="center">
        <Col xs={24} sm={20} md={16} lg={12}>
          <Card
            bordered={false}
            style={{ textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          >
            <Title level={2}>📊 Finansal Müşteri Yönetim Paneli</Title>
            <Paragraph>
              Banka müşterilerinizin borç ve ödeme hareketlerini görüntüleyin,
              yeni işlemler girin ve müşteri bilgilerini yönetin.
            </Paragraph>

            <Row gutter={[16, 16]} justify="center" style={{ marginTop: 24 }}>
              <Col>
                <Link to="/customers">
                  <Button type="primary" icon={<UserOutlined />} size="large">
                    Müşteri Listesi
                  </Button>
                </Link>
              </Col>

              <Col>
                <Link to="/transactions">
                  <Button type="default" icon={<FileTextOutlined />} size="large">
                    İşlem Listesi
                  </Button>
                </Link>
              </Col>

              <Col>
                <Link to="/add-customer">
                  <Button type="dashed" icon={<PlusOutlined />} size="large">
                    Yeni Müşteri
                  </Button>
                </Link>
              </Col>

              <Col>
                <Link to="/add-transaction">
                  <Button type="dashed" icon={<PlusOutlined />} size="large">
                    İşlem Ekle
                  </Button>
                </Link>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* KPI Kartları */}
      {summary && (
        <div style={{ marginTop: 40 }}>
          <Row gutter={16} justify="center">
            <Col span={4}>
              <Card>
                <Statistic
                  title="Toplam Müşteri"
                  value={summary.customerCount}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
            <Col span={4}>
              <Card>
                <Statistic
                  title="Toplam Borç"
                  value={summary.totalDebt}
                  suffix="₺"
                  prefix={<BarChartOutlined />}
                />
              </Card>
            </Col>
            <Col span={4}>
              <Card>
                <Statistic
                  title="Toplam Ödeme"
                  value={summary.totalPayment}
                  suffix="₺"
                  prefix={<CheckCircleOutlined />}
                />
              </Card>
            </Col>
            <Col span={4}>
              <Card>
              <Statistic
  title="Ödeme Oranı"
  value={`${summary.paymentRatio.toFixed(1)} %`}
  valueStyle={{
    color:
      summary.paymentRatio < 50
        ? 'red'
        : summary.paymentRatio < 100
        ? 'orange'
        : 'green',
  }}
/>

              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Sistemdeki En Son Ödeme Tarihi"
                  value={
                    summary.latestPaymentDate
                      ? new Date(summary.latestPaymentDate).toLocaleDateString('tr-TR')
                      : 'Yok'
                  }
                  prefix={<CalendarOutlined />}
                />
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default Home;
