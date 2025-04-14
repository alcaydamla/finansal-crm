using Microsoft.AspNetCore.Mvc;
using Operation;
using Entity;
using Dto;

namespace Wall
{
    [ApiController]
    [Route("api/[controller]")]
    public class aCustomerController : ControllerBase
    {
        private readonly oCustomerManager manager = new oCustomerManager();

        [HttpGet]
        public List<dCustomer> GetAllCustomers()
        {
            return manager.GetAllCustomers();
        }

        [HttpGet("{id}")]
        public dCustomer GetById(int id)
        {
            dCustomer customer = manager.GetCustomerById(id);
            if (customer == null)
            {
                throw new Exception("Müşteri bulunamadı.");
            }

            return customer;
        }

        [HttpPost]
        public String Add(dCustomer customer)
        {
            manager.AddCustomer(customer);
            return "Müşteri başarıyla eklendi.";
        }

        [HttpPut]
        public String Update(dCustomer customer)
        {
            manager.UpdateCustomer(customer);
            return "Müşteri güncellendi.";
        }

        [HttpDelete("{id}")]
        public string Delete(int id)
        {
            try
            {
                manager.DeleteCustomer(id);
                return "Müşteri silindi.";
            }
            catch
            {
                return "Silme işlemi başarısız oldu.";
            }
        }

        [HttpGet("balance/{id}")]
        public string GetBalance(int id)
        {
            try
            {
                var balance = manager.GetCustomerBalance(id);
                return $"Müşteri ID: {id}, Bakiye: {balance}";
            }
            catch (Exception ex)
            {
                return $"Bakiye alınamadı: {ex.Message}";
            }
        }
    }
}
