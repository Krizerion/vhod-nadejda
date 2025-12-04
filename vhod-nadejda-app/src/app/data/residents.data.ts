import { Announcement, Floor, AccountBalances } from './interfaces';

export const announcements: Announcement[] = [
  {
    id: 1,
    message: 'Следващо събрание на входа: 15.03.2024 г. в 18:00 ч.',
    icon: 'event',
  },
  // Add more announcements as needed
];

export const accountBalances: AccountBalances = {
  currentExpensesBalance: 0,
  repairsBalance: 0,
};

export const floors: Floor[] = [
  {
    number: 1,
    apartments: [
      {
        number: 116,
        debt: 0,
        residentsCount: 4,
        repairsFee: 2.5,
        currentExpensesFee: 6.0, // 4 * 1.50
        totalDebt: 0,
        lastPaymentDate: '25-Jan-2025',
      },
      { number: null, debt: 0 },
      {
        number: 117,
        debt: 0,
        residentsCount: 2,
        repairsFee: 2.5,
        currentExpensesFee: 3.0, // 2 * 1.50
        totalDebt: 0,
        lastPaymentDate: '10-Dec-2024',
      },
    ],
  },
  {
    number: 2,
    apartments: [
      {
        number: 118,
        debt: 0,
        residentsCount: 1,
        repairsFee: 2.5,
        currentExpensesFee: 1.5, // 1 * 1.50
        totalDebt: 0,
        lastPaymentDate: '15-Jan-2024',
      },
      {
        number: 119,
        debt: 0,
        residentsCount: 2,
        repairsFee: 2.5,
        currentExpensesFee: 3.0, // 2 * 1.50
        totalDebt: 0,
        lastPaymentDate: '15-Jan-2024',
      },
      {
        number: 120,
        debt: 0,
        residentsCount: 1,
        repairsFee: 2.5,
        currentExpensesFee: 1.5, // 1 * 1.50
        totalDebt: 0,
        lastPaymentDate: '15-Jan-2024',
      },
    ],
  },
  {
    number: 3,
    apartments: [
      {
        number: 121,
        debt: 0,
        residentsCount: 2,
        repairsFee: 2.5,
        currentExpensesFee: 8.0, // 2 * 4.00
        totalDebt: 0,
        lastPaymentDate: '15-Jan-2024',
      },
      {
        number: 122,
        debt: 0,
        residentsCount: 1,
        repairsFee: 2.5,
        currentExpensesFee: 4.0, // 1 * 4.00
        totalDebt: 0,
        lastPaymentDate: '15-Jan-2024',
      },
      {
        number: 123,
        debt: 0,
        residentsCount: 1,
        repairsFee: 2.5,
        currentExpensesFee: 4.0, // 1 * 4.00
        totalDebt: 0,
        lastPaymentDate: '15-Jan-2024',
      },
    ],
  },
  {
    number: 4,
    apartments: [
      {
        number: 124,
        debt: 0,
        residentsCount: 4,
        repairsFee: 2.5,
        currentExpensesFee: 16.0, // 4 * 4.00
        totalDebt: 0,
        lastPaymentDate: '15-Mar-2025',
      },
      {
        number: 125,
        debt: 0,
        residentsCount: 2,
        repairsFee: 2.5,
        currentExpensesFee: 8.0, // 2 * 4.00
        totalDebt: 0,
        lastPaymentDate: '15-Jan-2024',
      },
      {
        number: 126,
        debt: 0,
        residentsCount: 0,
        repairsFee: 2.5,
        currentExpensesFee: 0.0, // 0 * 4.00
        totalDebt: 0,
        lastPaymentDate: undefined,
      },
    ],
  },
  {
    number: 5,
    apartments: [
      {
        number: 127,
        debt: 0,
        residentsCount: 2,
        repairsFee: 2.5,
        currentExpensesFee: 8.0, // 2 * 4.00
        totalDebt: 0,
        lastPaymentDate: '15-Jan-2024',
      },
      {
        number: 128,
        debt: 0,
        residentsCount: 0,
        repairsFee: 2.5,
        currentExpensesFee: 0.0, // 0 * 4.00
        totalDebt: 0,
        lastPaymentDate: undefined,
      },
      {
        number: 129,
        debt: 0,
        residentsCount: 1,
        repairsFee: 2.5,
        currentExpensesFee: 4.0, // 1 * 4.00
        totalDebt: 0,
        lastPaymentDate: '15-Jan-2024',
      },
    ],
  },
  {
    number: 6,
    apartments: [
      {
        number: 130,
        debt: 0,
        residentsCount: 2,
        repairsFee: 2.5,
        currentExpensesFee: 8.0, // 2 * 4.00
        totalDebt: 0,
        lastPaymentDate: '15-Jan-2024',
      },
      {
        number: 131,
        debt: 0,
        residentsCount: 2,
        repairsFee: 2.5,
        currentExpensesFee: 8.0, // 2 * 4.00
        totalDebt: 0,
        lastPaymentDate: '15-Jan-2024',
      },
      {
        number: 132,
        debt: 0,
        residentsCount: 1,
        repairsFee: 2.5,
        currentExpensesFee: 4.0, // 1 * 4.00
        totalDebt: 0,
        lastPaymentDate: '15-Jan-2024',
      },
    ],
  },
  {
    number: 7,
    apartments: [
      {
        number: 133,
        debt: 0,
        residentsCount: 0,
        repairsFee: 2.5,
        currentExpensesFee: 0.0, // 0 * 4.00
        totalDebt: 0,
        lastPaymentDate: undefined,
      },
      {
        number: 134,
        debt: 0,
        residentsCount: 2,
        repairsFee: 2.5,
        currentExpensesFee: 8.0, // 2 * 4.00
        totalDebt: 0,
        lastPaymentDate: '15-Jan-2024',
      },
      {
        number: 135,
        debt: 0,
        residentsCount: 2,
        repairsFee: 2.5,
        currentExpensesFee: 8.0, // 2 * 4.00
        totalDebt: 0,
        lastPaymentDate: '15-Jan-2024',
      },
    ],
  },
  {
    number: 8,
    apartments: [
      {
        number: 136,
        debt: 0,
        residentsCount: 2,
        repairsFee: 2.5,
        currentExpensesFee: 8.0, // 2 * 4.00
        totalDebt: 0,
        lastPaymentDate: '15-Jan-2024',
      },
      {
        number: 137,
        debt: 0,
        residentsCount: 0,
        repairsFee: 2.5,
        currentExpensesFee: 0.0, // 0 * 4.00
        totalDebt: 0,
        lastPaymentDate: undefined,
      },
      {
        number: 138,
        debt: 0,
        residentsCount: 2,
        repairsFee: 2.5,
        currentExpensesFee: 8.0, // 2 * 4.00
        totalDebt: 0,
        lastPaymentDate: '15-Jan-2024',
      },
    ],
  },
];
