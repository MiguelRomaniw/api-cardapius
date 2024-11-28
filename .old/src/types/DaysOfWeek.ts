export enum DaysOfWeek {
  Monday = "Segunda",
  Tuesday = "Terça",
  Wednesday = "Quarta",
  Thursday = "Quinta",
  Friday = "Sexta",
  Saturday = "Sábado",
  Sunday = "Domingo",
}

const values = Object.values(DaysOfWeek);

export type DayOfWeek = (typeof values)[number];
