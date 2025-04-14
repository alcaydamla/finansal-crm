using Operation;
using Entity;
using Dto;

namespace Operation
{
    public class oCustomerManager
    {
        eCustomerDal dal = new eCustomerDal();

        public void AddCustomer(dCustomer customer)
        {
            dal.AddCustomer(customer);
        }

        public void DeleteCustomer(int id)
        {
            dal.Delete(id);
        }

        public void UpdateCustomer(dCustomer customer)
        {
            dal.Update(customer);
        }

        public dCustomer GetCustomerById(int id)
        {
            return dal.GetById(id);
        }

        public decimal GetCustomerBalance(int customerId)
        {
            return dal.GetBalance(customerId);
        }

        public List<dCustomer> GetAllCustomers()
        {
            return dal.GetAll();
        }

    }
}

