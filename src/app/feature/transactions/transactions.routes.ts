import { Routes } from '@angular/router';
import { TransactionsComponent } from './transactions.component';
import { AddTransactionComponent } from './add-transaction/add-transaction.component';

export const TRANSACTIONS_ROUTES: Routes = [
      {
        path: '',
        component: TransactionsComponent,
        title: 'Transactions',
      },
      {
        path: 'add',
        component: AddTransactionComponent,
        title: 'Add Transaction'
      }
];