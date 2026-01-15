import { Injectable, inject } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import {
  Announcement,
  Floor,
  AccountBalances,
  Bill,
  Transaction,
} from './interfaces';
import { CsvDataService } from './csv-data.service';
import {
  announcements as staticAnnouncements,
  accountBalances as staticAccountBalances,
  bills as staticBills,
  transactions as staticTransactions,
} from './residents.data';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private csvData = inject(CsvDataService);

  /**
   * Load all data:
   * - Announcements and Balances from constants (manually updated)
   * - Floors/Apartments from CSV file
   */
  loadData(): Observable<{
    announcements: Announcement[];
    accountBalances: AccountBalances;
    floors: Floor[];
  }> {
    return this.csvData.loadFloors().pipe(
      map((floors) => ({
        announcements: staticAnnouncements,
        accountBalances: staticAccountBalances,
        floors,
      }))
    );
  }

  /**
   * Load bills from constants (manually updated)
   */
  loadBills(): Observable<Bill[]> {
    return of(staticBills);
  }

  /**
   * Load transactions for a specific bill
   */
  loadTransactions(billId: number): Observable<Transaction[]> {
    const billTransactions = staticTransactions.filter(
      (t) => t.billId === billId
    );
    return of(billTransactions);
  }

  /**
   * Load transactions for a specific account type
   */
  loadAccountTransactions(
    accountType: 'currentExpenses' | 'repairs'
  ): Observable<Transaction[]> {
    const accountTransactions = staticTransactions.filter(
      (t) => t.accountType === accountType
    );
    return of(accountTransactions);
  }
}
