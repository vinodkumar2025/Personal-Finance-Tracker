import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { TransactionService } from '../../../services/transaction.service';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-transaction',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatCardModule,
    MatNativeDateModule,
    CommonModule
  ],
  templateUrl: './add-transaction.component.html',
  styleUrl: './add-transaction.component.scss'
})
export class AddTransactionComponent {
transactionForm: FormGroup;
  transactionTypes = ['Income', 'Expense'];
  categories = ['Salary', 'Freelancing', 'Food', 'Utilities', 'Internet', 'Entertainment'];

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private router: Router
  ) {
    this.transactionForm = this.fb.group({
      title: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      type: ['Expense', Validators.required],
      category: ['', Validators.required],
      date: [new Date(), Validators.required]
    });
  }

  onSubmit() {
    if (this.transactionForm.valid) {
      this.transactionService.add(this.transactionForm.value);
      this.router.navigate(['/transactions']);
    }
  }

  navigateBack() {
    this.router.navigate(['/transactions']);
  }
}
