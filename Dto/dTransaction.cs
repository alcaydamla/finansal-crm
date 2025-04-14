namespace Dto;

public class dTransaction
{
    public int TransactionId { get; set; }
    public int CustomerId { get; set; }
    public decimal Amount { get; set; }
    public string Type { get; set; }
    public DateTime TransactionDate { get; set; }
}
