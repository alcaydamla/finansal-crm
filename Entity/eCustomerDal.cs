using Entity;
using Dto;
using Oracle.ManagedDataAccess.Client;
using System.Data;

namespace Entity
{
    public class eCustomerDal
    {
        string connStr = @"User Id=C##CRMUSER;
                   Password=Password1!;
                   Data Source=(DESCRIPTION=
                     (ADDRESS=(PROTOCOL=TCP)(HOST=localhost)(PORT=1522))
                     (CONNECT_DATA=(SERVICE_NAME=ORCLPDB1)))";



        public decimal GetBalance(int customerId)
        {
            decimal balance = 0;

            using (var conn = new OracleConnection(connStr))
            {
                conn.Open();

                var cmd = new OracleCommand("sel_GetCustomerBalanceSp", conn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("p_customer_id", OracleDbType.Int32).Value = customerId;

                var output = new OracleParameter("p_balance", OracleDbType.Decimal)
                {
                    Direction = ParameterDirection.Output
                };
                cmd.Parameters.Add(output);

                cmd.ExecuteNonQuery();
                balance = ((Oracle.ManagedDataAccess.Types.OracleDecimal)output.Value).Value;

            }

            return balance;
        }

        public void AddCustomer(dCustomer customer)
        {
            using var conn = new OracleConnection(connStr);
            conn.Open();

            using var transaction = conn.BeginTransaction();
            try
            {
                var cmd = new OracleCommand("INSERT INTO CUSTOMERS (CUSTOMER_ID, FIRST_NAME, LAST_NAME, TYPE) VALUES (:id, :fname, :lname, :type)", conn);
                cmd.Transaction = transaction;

                cmd.Parameters.Add("id", customer.CustomerId);
                cmd.Parameters.Add("fname", customer.FirstName);
                cmd.Parameters.Add("lname", customer.LastName);
                cmd.Parameters.Add("type", customer.Type);

                cmd.ExecuteNonQuery();
                transaction.Commit();
                Console.WriteLine("Müşteri eklendi ve commit edildi.");
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                Console.WriteLine("HATA: " + ex.Message);
                throw;
            }
        }



        public void Delete(int id)
        {
            using var conn = new OracleConnection(connStr);
            conn.Open();

            var cmd = new OracleCommand("DELETE FROM CUSTOMERS WHERE CUSTOMER_ID = :id", conn);
            cmd.Parameters.Add("id", id);
            cmd.ExecuteNonQuery();
        }

        public void Update(dCustomer c)
        {
            using var conn = new OracleConnection(connStr);
            conn.Open();

            var cmd = new OracleCommand("UPDATE CUSTOMERS SET FIRST_NAME = :fname, LAST_NAME = :lname, TYPE = :type WHERE CUSTOMER_ID = :id", conn);
            cmd.Parameters.Add("fname", c.FirstName);
            cmd.Parameters.Add("lname", c.LastName);
            cmd.Parameters.Add("type", c.Type);
            cmd.Parameters.Add("id", c.CustomerId);
            cmd.ExecuteNonQuery();
        }

        public dCustomer GetById(int id)
        {
            dCustomer customer = new dCustomer();
            using var conn = new OracleConnection(connStr);
            conn.Open();

            var cmd = new OracleCommand("SELECT * FROM CUSTOMERS WHERE CUSTOMER_ID = :id", conn);
            cmd.Parameters.Add("id", id);

            using (var reader = cmd.ExecuteReader())
            {
                if (reader.Read())
                {
                    customer.CustomerId = Convert.ToInt32(reader["CUSTOMER_ID"]);
                    customer.FirstName = reader["FIRST_NAME"].ToString();
                    customer.LastName = reader["LAST_NAME"].ToString();
                    customer.Type = reader["TYPE"].ToString();
                }
            }

            return customer;
        }

        public List<dCustomer> GetAll()
        {
            List<dCustomer> customers = new List<dCustomer>();

            using (OracleConnection conn = new OracleConnection(connStr))
            {
                conn.Open();
                OracleCommand cmd = new OracleCommand("SELECT * FROM CUSTOMERS", conn);
                OracleDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    customers.Add(new dCustomer
                    {
                        CustomerId = Convert.ToInt32(reader["CUSTOMER_ID"]),
                        FirstName = reader["FIRST_NAME"].ToString(),
                        LastName = reader["LAST_NAME"].ToString(),
                        Type = reader["TYPE"].ToString()
                    });
                }

                return customers;
            }
        }



    }

}