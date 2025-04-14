using Dto;
using Oracle.ManagedDataAccess.Client;
using System.Data;

namespace Entity
{
    public class eTransactionDal
    {
        string connStr = @"User Id=C##CRMUSER;
                   Password=Password1!;
                   Data Source=(DESCRIPTION=
                     (ADDRESS=(PROTOCOL=TCP)(HOST=localhost)(PORT=1522))
                     (CONNECT_DATA=(SERVICE_NAME=ORCLPDB1)))";

        public void AddTransaction(dTransaction transaction)
        {
            try
            {
                using var conn = new OracleConnection(connStr);
                conn.Open();

                var cmd = new OracleCommand("INSERT INTO TRANSACTIONS (CUSTOMER_ID, AMOUNT, TYPE, TRANSACTION_DATE) VALUES (:customerId, :amount, :type, :transactionDate)", conn);

                cmd.Parameters.Add("customerId", OracleDbType.Int32).Value = transaction.CustomerId;
                cmd.Parameters.Add("amount", OracleDbType.Decimal).Value = transaction.Amount;
                cmd.Parameters.Add("type", OracleDbType.Varchar2).Value = transaction.Type;
                cmd.Parameters.Add("transactionDate", OracleDbType.Date).Value = transaction.TransactionDate;

                cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                Console.WriteLine("İşlem eklenemedi: " + ex.Message);
                throw;
            }
        }


        public dTransaction GetTransactionById(int id)
        {
            dTransaction transaction = null;

            using (var conn = new OracleConnection(connStr))
            {
                conn.Open();
                var cmd = new OracleCommand("SELECT * FROM TRANSACTIONS WHERE TRANSACTION_ID = :id", conn);
                cmd.Parameters.Add("id", OracleDbType.Int32).Value = id;

                using (var reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        transaction = new dTransaction
                        {
                            TransactionId = Convert.ToInt32(reader["TRANSACTION_ID"]),
                            CustomerId = Convert.ToInt32(reader["CUSTOMER_ID"]),
                            Amount = Convert.ToDecimal(reader["AMOUNT"]),
                            Type = reader["TYPE"].ToString(),
                            TransactionDate = Convert.ToDateTime(reader["TRANSACTION_DATE"])
                        };
                    }
                }
            }

            return transaction;
        }

        public void DeleteTransaction(int id)
        {
            using var conn = new OracleConnection(connStr);
            conn.Open();

            var cmd = new OracleCommand("DELETE FROM TRANSACTIONS WHERE TRANSACTION_ID = :id", conn);
            cmd.Parameters.Add("id", id);
            cmd.ExecuteNonQuery();
        }

        public List<dTransaction> GetAll()
        {
            List<dTransaction> transactions = new List<dTransaction>();

            using (OracleConnection conn = new OracleConnection(connStr))
            {
                conn.Open();
                OracleCommand cmd = new OracleCommand("SELECT * FROM TRANSACTIONS", conn);
                OracleDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    transactions.Add(new dTransaction
                    {
                        TransactionId = Convert.ToInt32(reader["TRANSACTION_ID"]),
                        CustomerId = Convert.ToInt32(reader["CUSTOMER_ID"]),
                        Amount = Convert.ToDecimal(reader["AMOUNT"]),
                        Type = reader["TYPE"].ToString(),
                        TransactionDate = Convert.ToDateTime(reader["TRANSACTION_DATE"])
                    });
                }

                return transactions;
            }
        }
        public dTransaction GetTransaction(int id)
        {
            dTransaction transaction = null;

            using (var conn = new OracleConnection(connStr))
            {
                conn.Open();
                var cmd = new OracleCommand("SELECT * FROM TRANSACTIONS WHERE TRANSACTION_ID = :id", conn);
                cmd.Parameters.Add("id", OracleDbType.Int32).Value = id;

                using (var reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        transaction = new dTransaction
                        {
                            TransactionId = Convert.ToInt32(reader["TRANSACTION_ID"]),
                            CustomerId = Convert.ToInt32(reader["CUSTOMER_ID"]),
                            Amount = Convert.ToDecimal(reader["AMOUNT"]),
                            Type = reader["TYPE"].ToString(),
                            TransactionDate = Convert.ToDateTime(reader["TRANSACTION_DATE"])
                        };
                    }
                }
            }

            return transaction;
        }




    }
}
