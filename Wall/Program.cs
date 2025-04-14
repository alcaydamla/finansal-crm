var builder = WebApplication.CreateBuilder(args);

// ✅ CORS politikasını burada tanımlıyoruz
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection(); // ← gerekirse yoruma alabilirsin

// ✅ CORS'u aktif et
app.UseCors("AllowAll");

app.UseAuthorization();

// ✅ Controller route'ları tanımla
app.MapControllers();

app.Run();
