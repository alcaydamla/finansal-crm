import React from 'react';
import { Card, Typography, Button, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import { UserOutlined, FileTextOutlined, PlusOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  return (
    <div style={{ padding: '60px 20px' }}>
      <Row justify="center">
        <Col xs={24} sm={20} md={16} lg={12}>
          <Card bordered={false} style={{ textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <Title level={2}>👋 Hoş Geldin Damla!</Title>
            <Paragraph>
              Finansal CRM sistemine hoş geldin. Buradan müşteri bilgilerini ve finansal işlemleri kolayca yönetebilirsin.
            </Paragraph>

            <Row gutter={[16, 16]} justify="center">
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
                <Col>
                <Col>
                <Link to="/add-transaction">
                  <Button type="dashed" icon={<PlusOutlined />} size="large">
                    İşlem Ekle
                  </Button>
                </Link>
                </Col>
             
              </Col>

              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
