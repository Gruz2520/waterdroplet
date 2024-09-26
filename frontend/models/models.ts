export type IUserModel = {
  username: string;
  password: string;
};

export interface IServiceItem {
  id_service?: number;
  service_name: string;
  price: string;
}

export default interface IArticle {
  id_article: number;
  article_name: string;
  article_text: string;
}

export type ContactFormData = {
  name: string;
  phone: string;
  message: string;
};

export interface IAddEmployeeFormData {
  name: string;
  phone: string;
  login: string;
  password: string;
}

export type EditUserFormData = {
  email: string;
  password: string;
  passwordRepeat: string;
};

export interface IRequestFormat {
  id: number;
  heading: {
    title: string;
    main: string;
  };
  request: string;
  response: string;
  footer?: Array<string>;
}

export type AccountType = 'admin' | 'business';

export interface IEmployeeShort {
  id_sotrudnik: number;
  login: string;
}
export interface IEmployee extends IEmployeeShort {
  id_business: number;
  phone: string;
  hashed_password: string;
}

export interface ICheck {
  validation_id: number;
  validation_date: string;
  full_name: number;
}
export interface IMeter {
  transaction_id: number;
  transaction_date: string;
  full_name: string;
  verdict: number;
  prev_number: string;
  new_number: string;
  payment_sum: string;
  ipu: string;
}

export interface ICustomer {
  login: string;
  full_name: string;
  email: string;
  address: string;
  id_physic: number;
  contract_number: string;
  ipus: string | null;
}

export interface ICheckLog {
  sotrudnik_photo_date: string;
  sotrudnik_number: string;
  admin_photo_date: string;
  admin_number: string;
  verdict: number;
  admin_name: string;
  sotrudnik_name: string;
}

export type ColumnSearchData = {
  search: String;
  dateFrom: String;
  dateTo: String;
};
