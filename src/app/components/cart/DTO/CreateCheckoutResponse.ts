export interface CreateCheckoutRresponse {
  id: string;
  object: string;
  live_mode: boolean;
  customer_initiated: boolean;
  api_version: string;
  method: string;
  status: string;
  amount: number;
  currency: string;
  threeDSecure: boolean;
  card_threeDSecure: boolean;
  save_card: boolean;
  product: string;
  description: string;
  metadata: Metadata;
  order: Record<string, unknown>;
  transaction: Transaction;
  reference: Reference;
  response: ApiResponseStatus;
  receipt: Receipt;
  customer: Customer;
  merchant: Merchant;
  source: Source;
  redirect: Redirect;
  post: Redirect;
  activities: Activity[];
  auto_reversed: boolean;
}

interface Metadata {
  udf1: string;
}

interface Transaction {
  timezone: string;
  created: string;
  url: string;
  expiry: Expiry;
  asynchronous: boolean;
  amount: number;
  currency: string;
  date: TransactionDate;
}

interface Expiry {
  period: number;
  type: string;
}

interface TransactionDate {
  created: number;
  transaction: number;
}

interface Reference {
  transaction: string;
  order: string;
}

interface ApiResponseStatus {
  code: string;
  message: string;
}

interface Receipt {
  email: boolean;
  sms: boolean;
}

interface Customer {
  first_name: string;
  last_name: string;
  email: string;
  phone: Phone;
}

interface Phone {
  country_code: string;
  number: string;
}

interface Merchant {
  country: string;
  currency: string;
  id: string;
}

interface Source {
  object: string;
  type: string;
  payment_type: string;
  channel: string;
  id: string;
  on_file: boolean;
  payment_method: string;
}

interface Redirect {
  status: string;
  url: string;
}

interface Activity {
  id: string;
  object: string;
  created: number;
  status: string;
  currency: string;
  amount: number;
  remarks: string;
  txn_id: string;
}
