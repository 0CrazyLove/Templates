using Backend.Data;
using Backend.DTOs.Dashboard;
using Backend.Services.Dashboard.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services.Dashboard.Implementations;

/// <summary>
/// Implementation of dashboard service for retrieving platform statistics.
/// 
/// Aggregates data from orders and services to provide KPIs for administrators.
/// </summary>
public class DashboardService(AppDbContext context) : IDashboardService
{
    /// <summary>
    /// Retrieves aggregated dashboard statistics including sales and counts.
    /// </summary>
    /// <returns>A DTO containing the calculated platform statistics.</returns>
    public async Task<DashboardStatsDto> GetDashboardStatsAsync()
    {
        var totalSales = await context.Orders.SumAsync(o => o.TotalAmount);
        var serviceCount = await context.Services.CountAsync();
        var orderCount = await context.Orders.CountAsync();

        return new DashboardStatsDto
        {
            TotalSales = totalSales,
            ServicetCount = serviceCount,
            OrderCount = orderCount
        };
    }
}