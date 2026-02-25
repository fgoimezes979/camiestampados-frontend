export interface CreateJournalEntry {
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