import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { announcements, accountBalances, floors } from '../data/residents.data';
import { ApartmentDetailsDialogComponent } from './apartment-details-dialog.component';
import { Apartment } from '../data/interfaces';

@Component({
  selector: 'vn-residents',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './residents.component.html',
  styleUrl: './residents.component.scss',
})
export class ResidentsComponent {
  // Data loaded from data files
  announcements = announcements;
  currentExpensesBalance = accountBalances.currentExpensesBalance;
  repairsBalance = accountBalances.repairsBalance;
  floors = floors;

  constructor(private dialog: MatDialog) {}

  openApartmentDetails(apartment: Apartment, floorNumber: number) {
    if (!apartment.number) {
      return;
    }

    this.dialog.open(ApartmentDetailsDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      data: { apartment, floorNumber },
    });
  }
}
