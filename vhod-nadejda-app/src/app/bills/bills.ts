import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DataService } from '../data/data.service';
import { Bill } from '../data/interfaces';
import { MonthYearPipe } from '../shared/pipes/month-year.pipe';

@Component({
  selector: 'vn-bills',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MonthYearPipe,
  ],
  templateUrl: './bills.html',
  styleUrl: './bills.scss',
})
export class BillsComponent implements OnInit {
  bills: Bill[] = [];

  private readonly router = inject(Router);
  private readonly dataService = inject(DataService);
  private readonly cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.dataService.loadBills().subscribe({
      next: (bills) => {
        this.bills = [...bills];
        this.cdr.detectChanges();
      },
      error: () => {
        this.bills = [];
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  getBillIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      Електричество: 'bolt',
      Вода: 'water_drop',
      Отопление: 'whatshot',
      'Общи части': 'apartment',
    };
    return iconMap[type] || 'receipt';
  }
}
