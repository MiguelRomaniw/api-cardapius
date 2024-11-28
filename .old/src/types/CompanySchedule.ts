import { DaysOfWeek } from "./DaysOfWeek";

export type CompanySchedule = {
  day: DaysOfWeek;
  startAt: string;
  endAt: string;
  isOpen: boolean;
}
