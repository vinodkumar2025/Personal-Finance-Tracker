import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
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
import { Chart, ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../services/transaction.service';

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
  providers: [provideNativeDateAdapter()],
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
  totalIncome = 0;
  totalExpenses = 0;
  netSavings = 0;

  // Transaction Table
  displayedColumns: string[] = ['date', 'title', 'category', 'amount', 'type'];
  allTransactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  dataSource = new MatTableDataSource<Transaction>(this.filteredTransactions);
  
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('lineChart') lineChart?: BaseChartDirective;
  @ViewChild('pieChart') pieChart?: BaseChartDirective;

  // Charts
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    datasets: [
      {
        data: [],
        label: 'Spending',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255, 99, 132, 0.8)',
        fill: 'origin',
      }
    ],
    labels: []
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true }
    }
  };

  public pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: []
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

  constructor(
    private transactionService: TransactionService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadTransactions() {
    this.allTransactions = this.transactionService.getAll();
    this.filterByDateRange();
  }

  filterByDateRange() {
    this.filteredTransactions = this.allTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= this.dateRange.start && 
             transactionDate <= this.dateRange.end;
    });

    this.dataSource.data = this.filteredTransactions;
    this.calculateSummary();
    this.prepareCharts();
    this.cdRef.detectChanges();
  }

  updateCharts() {
    setTimeout(() => {
      if (this.lineChart?.chart) {
        this.lineChart.chart.update();
      }
      
      if (this.pieChart?.chart) {
        // Complete recreation of pie chart for reliable updates
        const ctx = this.pieChart.ctx as unknown as CanvasRenderingContext2D;
        const config = {
          type: 'pie',
          data: this.pieChartData,
          options: this.pieChartOptions
        };
        this.pieChart.chart = new (Chart as any)(ctx, config);
      }
    });
  }

  onDateRangeChange() {
    this.filterByDateRange();
  }

  calculateSummary() {
    this.totalIncome = this.filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    this.totalExpenses = this.filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    this.netSavings = this.totalIncome - this.totalExpenses;
  }

  prepareCharts() {
    // Create new objects to force change detection
    const newLineData = {...this.lineChartData};
    const newPieData = {...this.pieChartData};

    // Reset data
    newLineData.datasets[0].data = [];
    newLineData.labels = [];
    newPieData.labels = [];
    newPieData.datasets[0].data = [];
    newPieData.datasets[0].backgroundColor = [];

    if (this.filteredTransactions.length > 0) {
      // Line chart data
      const dailyData = this.groupTransactionsByDay();
      newLineData.labels = dailyData.map(d => d.label);
      newLineData.datasets[0].data = dailyData.map(d => d.amount);

      // Pie chart data
      const categoryData = this.groupExpensesByCategory();
      newPieData.labels = categoryData.map(c => c.category);
      newPieData.datasets[0].data = categoryData.map(c => c.amount);
      newPieData.datasets[0].backgroundColor = this.generateColors(categoryData.length);
    }

    // Assign new data
    this.lineChartData = newLineData;
    this.pieChartData = newPieData;
    this.updateCharts();
  }

  groupTransactionsByDay(): { label: string; amount: number }[] {
    const result = new Map<string, number>();
    
    this.filteredTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const dateStr = new Date(t.date).toLocaleDateString();
        result.set(dateStr, (result.get(dateStr) || 0) + t.amount);
      });

    return Array.from(result.entries()).map(([dateStr, amount]) => ({
      label: new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount
    })).sort((a, b) => new Date(a.label).getTime() - new Date(b.label).getTime());
  }

  groupExpensesByCategory(): { category: string; amount: number }[] {
    const result = new Map<string, number>();
    
    this.filteredTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        result.set(t.category, (result.get(t.category) || 0) + t.amount);
      });

    return Array.from(result.entries()).map(([category, amount]) => ({
      category,
      amount
    }));
  }

  generateColors(count: number): string[] {
    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
      '#FF9F40', '#8AC24A', '#EA5F89', '#00ACC1', '#FF5722'
    ];
    return colors.slice(0, count);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  exportData() {
    console.log('Exporting data for date range:', this.dateRange);
  }
}