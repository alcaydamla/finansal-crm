using Entity;
using Dto;

namespace Operation
{
    public class oTransactionManager
    {
        private eTransactionDal transactionDal = new eTransactionDal();

        public void AddTransaction(dTransaction transaction)
        {
            transactionDal.AddTransaction(transaction);
        }

        public dTransaction GetTransactionById(int id)
        {
            return transactionDal.GetTransactionById(id);
        }

        public void DeleteTransaction(int id)
        {
            transactionDal.DeleteTransaction(id);
        }

        public List<dTransaction> GetAllTransactions()
        {
            return transactionDal.GetAll();
        }

        public dTransaction GetTransaction(int id)
        {
            return transactionDal.GetTransactionById(id);
        }
        public void UpdateTransactionStatus(int transactionId, string type, decimal amount)
        {
            transactionDal.UpdateTransactionStatus(transactionId, type, amount);
        }

        public List<dTransaction> GetTransactionsByCustomerId(int customerId)
        {
            var entities = transactionDal.GetByCustomerId(customerId);

            return entities.Select(t => new dTransaction
            {
                TransactionId = t.TransactionId,
                CustomerId = t.CustomerId,
                Amount = t.Amount,
                Type = t.Type,
                TransactionDate = t.TransactionDate
            }).ToList();
        }


    }
}