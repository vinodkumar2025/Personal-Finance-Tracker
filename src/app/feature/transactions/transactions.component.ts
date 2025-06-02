import { Component } from '@angular/core';
import { TransactionService, Transaction } from '../../services/transaction.service';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgFor, AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    NgFor,
    AsyncPipe],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss'
})
export class TransactionsComponent {
  displayedColumns: string[] = ['title', 'amount', 'type', 'category', 'date', 'actions'];
  transactions: Transaction[] = [];

  constructor(
    private transactionService: TransactionService
  ) {}

  ngOnInit() {
    this.transactions = this.transactionService.getAll();
  }

  addDummy(): void {
    const newTxn: Transaction = {
      id: crypto.randomUUID(),
      title: 'Test Income',
      amount: 1000,
      type: 'income',
      date: new Date().toISOString().split('T')[0],
      category: 'Salary'
    };

    this.transactionService.add(newTxn);
    console.log('Dummy transaction added.');
  }

  deleteTransaction(id: string): void {
    this.transactionService.delete(id);
    this.transactions = this.transactionService.getAll();
  }

}
