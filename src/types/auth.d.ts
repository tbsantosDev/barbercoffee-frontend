export interface LoginRequest {
    email: string;
    password: string;
  }
  export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
  }
  export interface RequestPassword {
    email: string
  }
  export interface ResetPassword {
    email: string
    token: string
    newPassword: string
  }
  