import { Component } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    RouterLink,
    BaseChartDirective, // Required for ng2-charts
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  income = 0;
  expense = 0;
  balance = 0;

  // Doughnut Chart Configuration
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartData!: ChartData<'doughnut'>;
  public doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'left', labels: { font: { size: 16 } } },
    }as any,
  };

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    const transactions = this.transactionService.getAll();

    // Calculate income, expense, balance
    this.income = transactions
      .filter((txn) => txn.type === 'income')
      .reduce((acc, curr) => acc + curr.amount, 0);

    this.expense = transactions
      .filter((txn) => txn.type === 'expense')
      .reduce((acc, curr) => acc + curr.amount, 0);

    this.balance = this.income - this.expense;

    // Prepare chart data
    const categoryTotals: Record<string, number> = {};
    transactions
      .filter((txn) => txn.type === 'expense')
      .forEach((txn) => {
        categoryTotals[txn.category] = (categoryTotals[txn.category] || 0) + txn.amount;
      });

    this.doughnutChartData = {
      labels: Object.keys(categoryTotals),
      datasets: [
        {
          data: Object.values(categoryTotals),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
          ],
          hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
          ],
        },
      ],
    };
  }
}