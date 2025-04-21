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
        private readonly oCustomerManager customerManager = new oCustomerManager();

        [HttpGet("dashboard-summary")]
        public IActionResult GetDashboardSummary()
        {
            var customerCount = customerManager.GetAllCustomers().Count;

            var transactions = transactionManager.GetAllTransactions();
            var totalDebt = transactions.Where(t => t.Type == "Debt").Sum(t => t.Amount);
            var totalPayment = transactions.Where(t => t.Type == "Payment").Sum(t => t.Amount);
            var paymentRatio = totalDebt > 0 ? (totalPayment / totalDebt) * 100 : 0;
            var latestPaymentDate = transactions
                .Where(t => t.Type == "Payment")
                .OrderByDescending(t => t.TransactionDate)
                .FirstOrDefault()?.TransactionDate;

            return Ok(new
            {
                customerCount,
                totalDebt,
                totalPayment,
                paymentRatio,
                latestPaymentDate
            });
        }

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

        [HttpGet("byCustomer/{customerId:int}")]
        public IActionResult GetTransactionsByCustomerId(int customerId)
        {
            var transactions = transactionManager.GetTransactionsByCustomerId(customerId);
            return Ok(transactions);
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

        [HttpPut("update-status")]
        public IActionResult UpdateTransactionStatus([FromBody] dTransaction dto)
        {
            transactionManager.UpdateTransactionStatus(dto.TransactionId, dto.Type, dto.Amount);
            return Ok(new { message = "İşlem güncellendi." });
        }

        [HttpGet("{id:int}")]
        public dTransaction GetById(int id)
        {
            return transactionManager.GetTransactionById(id);
        }
    }
}
