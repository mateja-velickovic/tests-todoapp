export interface User {
  name: string;
  email: string;
  password: string;
  address: string;
  zip: string;
  location: string;
}

export interface LoginForm extends Partial<User> {
  password: string;
  email: string;
  confirmation?: string;
}
