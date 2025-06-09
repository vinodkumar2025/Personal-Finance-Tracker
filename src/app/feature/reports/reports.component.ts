import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatTooltipModule,
    BaseChartDirective,
    DatePipe,
    CurrencyPipe
  ],
  providers: [provideNativeDateAdapter()], // Add this provider
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit, AfterViewInit {
  // Date Range
  dateRange = {
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    end: new Date()
  };

  // Summary Data
  totalIncome = 20000;
  totalExpenses = 15000;
  netSavings = 5000;

  // Transaction Table
  displayedColumns: string[] = ['date', 'category', 'description', 'amount', 'paymentMethod'];
  transactions = [
    { date: new Date('2023-01-05'), category: 'Salary', description: 'Monthly salary', amount: 5000, paymentMethod: 'Direct Deposit' },
    { date: new Date('2023-01-10'), category: 'Rent', description: 'Apartment rent', amount: -1200, paymentMethod: 'Bank Transfer' },
    { date: new Date('2023-01-15'), category: 'Groceries', description: 'Supermarket', amount: -350, paymentMethod: 'Credit Card' },
    { date: new Date('2023-01-20'), category: 'Freelance', description: 'Website project', amount: 2000, paymentMethod: 'PayPal' },
    { date: new Date('2023-01-25'), category: 'Utilities', description: 'Electric bill', amount: -150, paymentMethod: 'Bank Transfer' },
  ];
  dataSource = new MatTableDataSource(this.transactions);
  
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Charts
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'Spending',
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      }
    ],
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July']
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true }
    }
  };

  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Rent', 'Groceries', 'Utilities', 'Entertainment', 'Transport'],
    datasets: [{
      data: [1200, 350, 150, 200, 100],
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF'
      ]
    }]
  };

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'right',
      }
    }
  };

  public pieChartType: ChartType = 'pie';

  // Insights
  currentInsight = "Review your utility expenses. They've increased by 15% compared to last month.";

  ngOnInit(): void {
    debugger
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  exportData() {
    console.log('Exporting data for date range:', this.dateRange);
    // Implement actual export functionality here
  }
}