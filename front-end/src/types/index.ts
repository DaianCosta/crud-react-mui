export interface Task {
  id: string;
  description: string;
  /** YYYY-MM-DD */
  date: string;
  /** HH:mm */
  time: string;
  reminded: boolean;
}
