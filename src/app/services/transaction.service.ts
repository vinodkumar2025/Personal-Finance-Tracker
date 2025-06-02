import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
private storageKey = 'transactions';

  constructor(private localStorage: LocalStorageService) {}

  getAll(): Transaction[] {
    return this.localStorage.getItem<Transaction[]>(this.storageKey) || [];
  }

  add(transaction: Transaction): void {
    const transactions = this.getAll();
    transactions.push(transaction);
    this.localStorage.setItem(this.storageKey, transactions);
  }

  update(updatedTransaction: Transaction): void {
    let transactions = this.getAll();
    transactions = transactions.map(t => t.id === updatedTransaction.id ? updatedTransaction : t);
    this.localStorage.setItem(this.storageKey, transactions);
  }

  delete(id: string): void {
    const transactions = this.getAll().filter(t => t.id !== id);
    this.localStorage.setItem(this.storageKey, transactions);
  }

  getById(id: string): Transaction | undefined {
    return this.getAll().find(t => t.id === id);
  }

  clearAll(): void {
    this.localStorage.removeItem(this.storageKey);
  }
}
