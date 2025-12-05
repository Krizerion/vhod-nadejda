import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DataService } from '../data/data.service';
import { Apartment, Announcement, Floor } from '../data/interfaces';

@Component({
  selector: 'vn-residents',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './residents.component.html',
  styleUrl: './residents.component.scss',
})
export class ResidentsComponent implements OnInit {
  announcements: Announcement[] = [];
  currentExpensesBalance = 0;
  repairsBalance = 0;
  floors: Floor[] = [];

  private readonly router = inject(Router);
  private readonly dataService = inject(DataService);
  private readonly cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.dataService.loadData().subscribe((data) => {
      this.announcements = [...data.announcements];
      this.currentExpensesBalance = data.accountBalances.currentExpensesBalance;
      this.repairsBalance = data.accountBalances.repairsBalance;
      this.floors = [...data.floors];
      // Force change detection
      this.cdr.detectChanges();
    });
  }

  openApartmentDetails(apartment: Apartment): void {
    if (!apartment.number) {
      return;
    }

    this.router.navigate(['/apartment', apartment.number]);
  }
}
