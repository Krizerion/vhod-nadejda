import { Announcement, AccountBalances, Bill } from './interfaces';

export const announcements: Announcement[] = [
  {
    id: 1,
    message: 'Следващо събрание на входа: 19 февруари 2026 г. в 19:30 ч.',
    icon: 'event',
  },
  // Add more announcements as needed
];

export const accountBalances: AccountBalances = {
  currentExpensesBalance: 349.13,
  repairsBalance: 267.67,
};

export const bills: Bill[] = [
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
