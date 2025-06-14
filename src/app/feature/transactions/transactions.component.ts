import { Component } from '@angular/core';
import { TransactionService, Transaction } from '../../services/transaction.service';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgFor, AsyncPipe, CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    NgFor,
    AsyncPipe],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss'
})
export class TransactionsComponent {
  displayedColumns: string[] = ['title', 'amount', 'type', 'category', 'date', 'actions'];
  transactions: Transaction[] = [];

  constructor(
    private transactionService: TransactionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.transactions = this.transactionService.getAll();
  }

  deleteTransaction(id: string): void {
    this.transactionService.delete(id);
    this.transactions = this.transactionService.getAll();
  }

  editTransaction(id: string): void {
    this.router.navigate(['/transactions/edit', id]);
  }
}
