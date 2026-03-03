export interface JournalEntry {
account_code: any;
credit: any;
debit: any;
accountName: any;
  id?: number;
  operationId: number;        // 🔗 relación
  date: string;
  description: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  user: string;
  isActive?: boolean;
}
