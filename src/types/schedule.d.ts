export interface ScheduleDataByCurrentUser {
  id: number;
  dateTime: string;
  cutTheHair: boolean;
  userId: number;
  barberId: number;
}
export interface ScheduleResponseByCurrentUser {
  dados: ScheduleData[];
  message: string;
  status: boolean;
}

export interface ScheduleRequest {
    dateTime: string;
    barberId: number;
}

export interface ScheduleAvailableSlots {
  dados: string[];
  message: string;
  status: boolean;
}
