import React, { useState } from 'react';

const AddTransaction: React.FC = () => {
  const [customerId, setCustomerId] = useState<number | string>('');
  const [amount, setAmount] = useState<number | string>('');
  const [transactionType, setTransactionType] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Burada API'ye verileri gönderebilirsiniz
    console.log({ customerId, amount, transactionType });
  };

  return (
    <div>
      <h2>Add Transaction</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Customer ID:</label>
          <input
            type="number"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          />
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div>
          <label>Transaction Type:</label>
          <input
            type="text"
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddTransaction;
