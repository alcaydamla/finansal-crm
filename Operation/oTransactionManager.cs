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

        public List<dTransaction> GetTransactionsByCustomerId(int customerId)
        {
            return transactionDal.GetAll()
                .Where(t => t.CustomerId == customerId)
                .ToList();
        }

        public dTransaction GetTransaction(int id)
        {
            return transactionDal.GetTransaction(id); // ✅ id parametresi verildi
        }


    }
}