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
            using var conn = new OracleConnection(connStr);
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

            return ((Oracle.ManagedDataAccess.Types.OracleDecimal)output.Value).Value;
        }


        public void AddCustomer(dCustomer customer)
        {
            using var conn = new OracleConnection(connStr);
            conn.Open();

            try
            {
                var cmd = new OracleCommand("INSERT_CUSTOMERSP", conn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("p_customerid", OracleDbType.Int32).Value = customer.CustomerId;
                cmd.Parameters.Add("p_firstName", OracleDbType.Varchar2).Value = customer.FirstName;
                cmd.Parameters.Add("p_lastName", OracleDbType.Varchar2).Value = customer.LastName;
                cmd.Parameters.Add("p_type", OracleDbType.Varchar2).Value = customer.Type;

                cmd.ExecuteNonQuery();
                Console.WriteLine("Müşteri SP ile eklendi.");
            }
            catch (Exception ex)
            {
                Console.WriteLine("SP ile müşteri eklenemedi: " + ex.Message);
                throw;
            }
        }

        public void Delete(int id)
        {
            using var conn = new OracleConnection(connStr);
            conn.Open();

            var cmd = new OracleCommand("DELETE_CUSTOMERSP", conn);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.Add("p_customerid", OracleDbType.Int32).Value = id;
            cmd.ExecuteNonQuery();
        }

        public void Update(dCustomer c)
        {
            using var conn = new OracleConnection(connStr);
            conn.Open();

            var cmd = new OracleCommand("UPDATE_CUSTOMERSP", conn);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.Add("p_customerid", OracleDbType.Int32).Value = c.CustomerId;
            cmd.Parameters.Add("p_firstname", OracleDbType.Varchar2).Value = c.FirstName;
            cmd.Parameters.Add("p_lastname", OracleDbType.Varchar2).Value = c.LastName;
            cmd.Parameters.Add("p_type", OracleDbType.Varchar2).Value = c.Type;

            cmd.ExecuteNonQuery();
        }

        public dCustomer GetById(int id)
        {
            dCustomer customer = new dCustomer();
            using var conn = new OracleConnection(connStr);
            conn.Open();

            var cmd = new OracleCommand("SELECT_CUSTOMER_GETBYIDSP", conn);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.Add("p_customerid", OracleDbType.Int32).Value = id;

            var p_firstname = cmd.Parameters.Add("p_firstname", OracleDbType.Varchar2, 50);
            p_firstname.Direction = ParameterDirection.Output;

            var p_lastname = cmd.Parameters.Add("p_lastname", OracleDbType.Varchar2, 50);
            p_lastname.Direction = ParameterDirection.Output;

            var p_type = cmd.Parameters.Add("p_type", OracleDbType.Varchar2, 50);
            p_type.Direction = ParameterDirection.Output;

            cmd.ExecuteNonQuery();

            return new dCustomer
            {
                CustomerId = id,
                FirstName = p_firstname.Value?.ToString(),
                LastName = p_lastname.Value?.ToString(),
                Type = p_type.Value?.ToString()
            };
        }

        public List<dCustomer> GetAll()
        {
            var customers = new List<dCustomer>();

            using var conn = new OracleConnection(connStr);
            conn.Open();

            var cmd = new OracleCommand("SELECT_ALLCUSTOMERSP", conn);
            cmd.CommandType = CommandType.StoredProcedure;

            var p_cursor = cmd.Parameters.Add("p_customers", OracleDbType.RefCursor);
            p_cursor.Direction = ParameterDirection.Output;

            using var reader = cmd.ExecuteReader();

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