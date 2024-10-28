
  export interface UserResponse {
    dados: {
        firstName: string;
        lastName: string;
        pointsAmount: number;
      };
      message: string;
      status: boolean;
  }
  export interface User {
    dados: Dados;
    message: string;
    status: boolean;
  }
  
  export interface Dados {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    role: number;
    emailConfirmed: boolean;
    emailConfirmationToken: string;
    passwordResetToken: string;
    passwordResetTokenExpires: string; // ISO 8601 formatted date-time string
  }