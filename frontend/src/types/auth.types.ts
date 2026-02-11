
export interface IUser {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

export interface SignupFormValues {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormValues {
  email: string;
  password: string;
}