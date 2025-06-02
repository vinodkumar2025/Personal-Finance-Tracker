import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  transactions = [
  {
    id: 'txn1',
    title: 'Salary - June',
    amount: 50000,
    type: 'income',
    date: '2025-06-01',
    category: 'Salary'
  },
  {
    id: 'txn2',
    title: 'Groceries',
    amount: 2500,
    type: 'expense',
    date: '2025-06-02',
    category: 'Food'
  },
  {
    id: 'txn3',
    title: 'Electricity Bill',
    amount: 1800,
    type: 'expense',
    date: '2025-06-03',
    category: 'Utilities'
  },
  {
    id: 'txn4',
    title: 'Freelance Project',
    amount: 10000,
    type: 'income',
    date: '2025-06-05',
    category: 'Freelancing'
  },
  {
    id: 'txn5',
    title: 'Internet Recharge',
    amount: 999,
    type: 'expense',
    date: '2025-06-06',
    category: 'Internet'
  },
  {
    id: 'txn6',
    title: 'Movie Night',
    amount: 1200,
    type: 'expense',
    date: '2025-06-07',
    category: 'Entertainment'
  }
]

categories = [
  { id: 'cat1', name: 'Salary', type: 'income' },
  { id: 'cat2', name: 'Freelancing', type: 'income' },
  { id: 'cat3', name: 'Food', type: 'expense' },
  { id: 'cat4', name: 'Utilities', type: 'expense' },
  { id: 'cat5', name: 'Internet', type: 'expense' },
  { id: 'cat6', name: 'Entertainment', type: 'expense' },
  { id: 'cat7', name: 'Rent', type: 'expense' },
  { id: 'cat8', name: 'Savings', type: 'income' }
]


  constructor() {
    if (!localStorage.getItem('transactions')) {
      this.setItem('transactions', this.transactions);
    }

    if (!localStorage.getItem('categories')) {
      this.setItem('categories', this.categories);
    }
  }


  setItem(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) as T : null;
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}
