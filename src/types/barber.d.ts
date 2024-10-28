export interface Barber {
    id: number;
    name: string;
  }
  
  export interface BarberListResponse {
    dados: Barber[];
    message: string;
    status: boolean;
  }
  