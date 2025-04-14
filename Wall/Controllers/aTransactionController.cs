using Microsoft.AspNetCore.Mvc;
using Operation;
using Dto;

namespace Wall
{
    [ApiController]
    [Route("api/[controller]")]
    public class aTransactionController : ControllerBase
    {
        private readonly oTransactionManager transactionManager = new oTransactionManager();

        [HttpPost]
        public string AddTransaction([FromBody] dTransaction transaction)
        {
            transactionManager.AddTransaction(transaction);
            return "İşlem eklendi.";
        }

        [HttpDelete("delete/{id}")]
        public string DeleteTransaction(int id)
        {
            try
            {
                transactionManager.DeleteTransaction(id);
                return "İşlem silindi.";
            }
            catch
            {
                return "Silme işleminde hata aldı.";
            }
        }

        [HttpGet]
        public List<dTransaction> GetAllTransactions()
        {
            return transactionManager.GetAllTransactions();
        }


        [HttpGet("{id}")]
        public dTransaction GetById(int id)
        {
            return transactionManager.GetTransactionById(id);
        }

        [HttpGet("customer/{customerId}/debts")]
        public IActionResult GetDebtsByCustomerId(int customerId)
        {
            var debts = transactionManager
                .GetAllTransactions()
                .Where(t => t.CustomerId == customerId && t.Type == "Debt")
                .ToList();

            return Ok(debts);
        }

        [HttpGet("get/{id}")]
        public IActionResult GetTransaction(int id)
        {
            var transaction = transactionManager.GetTransaction(id);
            return Ok(transaction);
        }



    }
}
