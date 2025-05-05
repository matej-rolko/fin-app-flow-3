export class CreateExpenseDto {
  categoryID: number;
  price: number;
  date: Date;
  img?: string;
  byUserID: number;
}
