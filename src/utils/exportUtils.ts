
import { Transaction } from '@/types/transaction';

export const exportToCSV = (transactions: Transaction[], filename: string) => {
  const headers = [
    'Date',
    'Type',
    'Amount',
    'Description',
    'Category',
    'Subcategory',
    'Account',
    'Note'
  ];

  const csvContent = [
    headers.join(','),
    ...transactions.map(transaction => [
      transaction.date,
      transaction.type,
      transaction.amount,
      `"${transaction.description}"`,
      transaction.category,
      transaction.subcategory || '',
      transaction.account,
      `"${transaction.note || ''}"`
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const exportToJSON = (transactions: Transaction[], filename: string) => {
  const jsonContent = JSON.stringify(transactions, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
