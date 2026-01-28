import { Injectable } from '@nestjs/common';
import { AnnouncementDto, AccountBalancesDto, BillDto, TransactionDto } from '../common/dto';
import { AccountType } from '../common/enums/account-type.enum';

@Injectable()
export class MockDataService {
  private readonly announcements: AnnouncementDto[] = [
    {
      id: 1,
      message: 'Следващо събрание на входа: 19 февруари 2026 г. в 19:30 ч.',
      icon: 'event',
    },
  ];

  private readonly accountBalances: AccountBalancesDto = {
    expensesBalance2025: 349.13,
    repairsBalance2025: 267.67,
  };

  private readonly bills: BillDto[] = [
    {
      id: 1,
      type: 'Поддръжка асансьор',
      amount: 61.36,
      paid: true,
      paidDate: '10-Oct-2025',
      description: 'Сметка за декември 2025',
    },
    {
      id: 2,
      type: 'Ток асансьор',
      amount: 20.79,
      paid: true,
      paidDate: '16-Dec-2025',
      description: 'Сметка за ноември 2025',
    },
    {
      id: 3,
      type: 'Ток общи части',
      amount: 6.14,
      paid: true,
      paidDate: '16-Dec-2025',
      description: 'Сметка за ноември 2025',
    },
    {
      id: 4,
      type: 'Поддръжка асансьор',
      amount: 184.02,
      paid: true,
      paidDate: '12-Dec-2025',
      description: 'Поддръжка на асансьор до края на март 2026',
    },
  ];

  private readonly currentExpensesTransactions: TransactionDto[] = [
    {
      id: 150120261,
      accountType: 'currentExpenses',
      type: 'income',
      amount: 192,
      date: '19-Jan-2026',
      description: 'Платени такси за цялата година от апартаменти 121, 123 и 134',
    },
    {
      id: 150120261,
      accountType: 'currentExpenses',
      type: 'income',
      amount: 24,
      date: '19-Jan-2026',
      description: 'Платени такси за януари и февруари от апартаменти 129 и 131',
    },
  ];

  private readonly repairsTransactions: TransactionDto[] = [
    {
      id: 150120262,
      accountType: 'repairs',
      type: 'income',
      amount: 90.0,
      date: '19-Jan-2026',
      description: 'Платени такси за цялата година от апартаменти 121, 123 и 134',
    },
    {
      id: 150120262,
      accountType: 'repairs',
      type: 'income',
      amount: 10,
      date: '19-Jan-2026',
      description: 'Платени такси за януари и февруари от апартаменти 129 и 131',
    },
  ];

  getAnnouncements(): AnnouncementDto[] {
    return this.announcements;
  }

  getAccountBalances(): AccountBalancesDto {
    return this.accountBalances;
  }

  getBills(): BillDto[] {
    return this.bills;
  }

  getBillById(id: number): BillDto | undefined {
    return this.bills.find((bill) => bill.id === id);
  }

  getTransactionsByBillId(billId: number): TransactionDto[] {
    return this.getAllTransactions().filter((t) => t.billId === billId);
  }

  getTransactionsByAccountType(accountType: AccountType): TransactionDto[] {
    return accountType === AccountType.CURRENT_EXPENSES
      ? this.currentExpensesTransactions
      : this.repairsTransactions;
  }

  private getAllTransactions(): TransactionDto[] {
    return [...this.currentExpensesTransactions, ...this.repairsTransactions];
  }
}
