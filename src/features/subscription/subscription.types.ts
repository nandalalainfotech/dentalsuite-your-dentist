export type PaymentType =
  | 'PAY_PER_PATIENT'
  | 'PAY_PER_MONTH';

export interface SubscriptionPrice {
  pay_per_patient_amount: number;
  pay_per_month_amount: number;
}

export interface PracticeSubscription {
  id: string;

  practice_id: string;

  monthly_addon_enabled: boolean;

  current_payment_type: PaymentType;

  current_price: SubscriptionPrice;

  subscription_start_date: string;

  subscription_end_date: string;

  pending_payment_type:
  | PaymentType
  | null;

  pending_price:
  | SubscriptionPrice
  | null;

  pending_start_date:
  | string
  | null;

  is_active: boolean;

  created_at: string;

  updated_at: string;
}