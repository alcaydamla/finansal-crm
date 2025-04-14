import axios from 'axios';

const API_URL = 'http://localhost:5290/api/acustomer';

class TransactionService {
  addTransaction(transaction: { customerId: number, amount: number, type: string, transactionDate: string }) {
    return axios.post(`${API_URL}`, transaction)
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  }

  getBalance(customerId: number) {
    return axios.get(`${API_URL}/balance/${customerId}`)
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  }
}

export default new TransactionService();
