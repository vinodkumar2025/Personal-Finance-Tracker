import { Component } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,
    MatCardModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
 income = 0;
  expense = 0;
  balance = 0;

  pieChartLabels: string[] = [];
  pieChartData: number[] = [];

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    const transactions = this.transactionService.getAll();

    this.income = transactions
      .filter(txn => txn.type === 'income')
      .reduce((acc, curr) => acc + curr.amount, 0);

    this.expense = transactions
      .filter(txn => txn.type === 'expense')
      .reduce((acc, curr) => acc + curr.amount, 0);

    this.balance = this.income - this.expense;

    // Pie chart data
    const categoryTotals: { [key: string]: number } = {};
    transactions
      .filter(txn => txn.type === 'expense')
      .forEach(txn => {
        categoryTotals[txn.category] = (categoryTotals[txn.category] || 0) + txn.amount;
      });

    this.pieChartLabels = Object.keys(categoryTotals);
    this.pieChartData = Object.values(categoryTotals);
  }
}
