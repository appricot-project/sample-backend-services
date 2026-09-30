using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi;
using TreeEditor.Application;
using TreeEditor.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("TreeDatabase")));
builder.Services.AddScoped<TreeService>();
builder.Services.AddScoped<SampleDataSeeder>();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "TreeEditor API",
        Version = "v1"
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy => policy
        .WithOrigins("http://localhost:5173", "https://localhost:5173")
        .AllowAnyHeader()
        .AllowAnyMethod());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    await db.Database.MigrateAsync();
    await scope.ServiceProvider
        .GetRequiredService<SampleDataSeeder>()
        .SeedIfEmptyAsync();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "TreeEditor API v1");
    });
}

app.UseHttpsRedirection();
app.UseCors("Frontend");

app.UseAuthorization();

app.MapControllers();

app.Run();
