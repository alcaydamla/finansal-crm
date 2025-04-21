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

                var cmd = new OracleCommand("INSERT_TRANSACTIONSP", conn);
                cmd.CommandType = CommandType.StoredProcedure;


                cmd.Parameters.Add("p_customerId", OracleDbType.Int32).Value = transaction.CustomerId;
                cmd.Parameters.Add("p_amount", OracleDbType.Decimal).Value = transaction.Amount;
                cmd.Parameters.Add("p_type", OracleDbType.Varchar2).Value = transaction.Type;
                cmd.Parameters.Add("p_transactionDate", OracleDbType.Date).Value = transaction.TransactionDate;

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
            using var conn = new OracleConnection(connStr);
            conn.Open();

            var cmd = new OracleCommand("SELECT_TRANSACTIONBYIDSP", conn)
            {
                CommandType = CommandType.StoredProcedure
            };
            var p_customerid = cmd.Parameters.Add("p_customerid", OracleDbType.Int32);
            p_customerid.Direction = ParameterDirection.Output;

            var p_amount = cmd.Parameters.Add("p_amount", OracleDbType.Decimal);
            p_amount.Direction = ParameterDirection.Output;

            var p_type = cmd.Parameters.Add("p_type", OracleDbType.Varchar2, 50);
            p_type.Direction = ParameterDirection.Output;

            var p_transactionDate = cmd.Parameters.Add("p_transactionDate", OracleDbType.Date);
            p_transactionDate.Direction = ParameterDirection.Output;

            cmd.ExecuteNonQuery();

            return new dTransaction
            {
                TransactionId = id,
                CustomerId = Convert.ToInt32(p_customerid.Value),
                Amount = Convert.ToDecimal(p_amount.Value),
                Type = p_type.Value?.ToString(),
                TransactionDate = Convert.ToDateTime(p_transactionDate.Value)
            };
        }

        public void DeleteTransaction(int id)
        {
            using var conn = new OracleConnection(connStr);
            conn.Open();

            var cmd = new OracleCommand("DELETE_TRANSACTIONSP", conn);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.Add("p_transactionid", OracleDbType.Int32).Value = id;
            cmd.ExecuteNonQuery();
        }

        public List<dTransaction> GetAll()
        {
            List<dTransaction> transactions = new List<dTransaction>();

            using (OracleConnection conn = new OracleConnection(connStr))
            {
                conn.Open();
                using (OracleCommand cmd = new OracleCommand("SELECT_TRANSACTIONSP", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("p_cursor", OracleDbType.RefCursor).Direction = ParameterDirection.Output;

                    using (OracleDataReader reader = cmd.ExecuteReader())
                    {
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
                    }
                }
            }

            return transactions;
        }

        public void UpdateTransactionStatus(int transactionId, string type, decimal amount)
        {
            using var conn = new OracleConnection(connStr);
            conn.Open();

            using var cmd = new OracleCommand("UPDATE_TRANSACTION_STATUS_SP", conn);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.Add("p_transaction_id", OracleDbType.Int32).Value = transactionId;
            cmd.Parameters.Add("p_type", OracleDbType.Varchar2).Value = type;
            cmd.Parameters.Add("p_amount", OracleDbType.Decimal).Value = amount;

            cmd.ExecuteNonQuery();
        }
        public List<dTransaction> GetByCustomerId(int customerId)
        {
            List<dTransaction> transactions = new List<dTransaction>();

            using (OracleConnection conn = new OracleConnection(connStr))
            {
                conn.Open();
                using (OracleCommand cmd = new OracleCommand("SELECT_TRANSACTIONSBYCUSTOMERIDSP", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Girdi parametresi: müşteri ID
                    cmd.Parameters.Add("p_customerId", OracleDbType.Int32).Value = customerId;

                    // Çıktı: cursor
                    cmd.Parameters.Add("p_cursor", OracleDbType.RefCursor).Direction = ParameterDirection.Output;

                    using (OracleDataReader reader = cmd.ExecuteReader())
                    {
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
                    }
                }
            }

            return transactions;
        }


    }
}
