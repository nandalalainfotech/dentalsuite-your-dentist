export type PaymentType =
  | 'PAY_PER_PATIENT'
  | 'PAY_PER_MONTH';

export interface PracticeSubscription {
  id: string;

  practice_id: string;

  current_payment_type: PaymentType;

  current_price: number;

  subscription_start_date: string;

  subscription_end_date: string;

  pending_payment_type:
    | PaymentType
    | null;

  pending_price:
    | number
    | null;

  pending_start_date:
    | string
    | null;

  is_active: boolean;

  created_at: string;

  updated_at: string;
}