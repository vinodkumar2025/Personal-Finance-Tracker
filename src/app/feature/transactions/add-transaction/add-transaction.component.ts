import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { Router, ActivatedRoute } from '@angular/router';
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
  transactionTypes = ['income', 'expense'];
  allCategories: Record<'income' | 'expense', string[]> = {
    income: ['Salary', 'Freelancing'],
    expense: ['Groceries', 'Transport', 'Utilities', 'Entertainment', 'Internet']
  };
  categories: string[] = [];

  transactionId: string | null = null;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.transactionForm = this.fb.group({
      title: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      type: ['expense', Validators.required],
      category: ['', Validators.required],
      date: [new Date(), Validators.required]
    });
  }

  ngOnInit() {
    // Listen to type changes
    this.transactionForm.get('type')?.valueChanges.subscribe((selectedType: string) => {
      this.categories = this.allCategories[selectedType as 'income' | 'expense'];
      this.transactionForm.get('category')?.setValue(null);
    });

    // Check if edit mode
    this.transactionId = this.route.snapshot.paramMap.get('id');
    if (this.transactionId) {
      this.isEditMode = true;
      const txn = this.transactionService.getById(this.transactionId);
      if (txn) {
        this.categories = this.allCategories[txn.type];
        this.transactionForm.patchValue({
          title: txn.title,
          amount: txn.amount,
          type: txn.type,
          category: txn.category,
          date: new Date(txn.date) // ensure Date object for datepicker
        });
      }
    } else {
      const initialType = this.transactionForm.get('type')?.value;
      if (initialType) {
        this.categories = this.allCategories[initialType as 'income' | 'expense'];
      }
    }
  }

  onSubmit() {
    if (this.transactionForm.valid) {
      const formValue = { ...this.transactionForm.value };

      // Format date to yyyy-MM-dd
      const date: Date = formValue.date;
      if (date instanceof Date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        formValue.date = `${year}-${month}-${day}`;
      }

      if (this.isEditMode && this.transactionId) {
        formValue.id = this.transactionId;
        this.transactionService.update(formValue);
      } else {
        formValue.id = Date.now().toString();
        this.transactionService.add(formValue);
      }

      this.router.navigate(['/transactions']);
    }
  }

  navigateBack() {
    this.router.navigate(['/transactions']);
  }
}
