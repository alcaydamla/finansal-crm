import { Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import CustomersPage from './pages/CustomersPage';
import TransactionsPage from './pages/TransactionsPage';
import AddCustomerForm from './pages/AddCustomerForm'; 
import AddTransactionPage from './pages/AddTransactionPage'; 
import CustomerTransactions from './pages/CustomerTransactions';
import CustomerDetail from './pages/CustomerDetail';


function App() {
  return (
    <>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <Link to="/">Ana Sayfa</Link> |{" "}
        <Link to="/customers">Müşteriler</Link> |{" "}
        <Link to="/transactions">İşlemler</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/add-customer" element={<AddCustomerForm />} /> 
        <Route path="/add-transaction" element={<AddTransactionPage />} />
        <Route path="/musteri/:id/islemler" element={<CustomerTransactions />} />
        <Route path="/customer/:id" element={<CustomerDetail />} />

      </Routes>
    </>
  );
}

export default App;
