import { v4 as uuidv4 } from "uuid";

const STUDENT_ID_KEY = "polling_student_id";
const STUDENT_NAME_KEY = "polling_student_name";


export const getOrCreateStudentId = (): string => {
  let id = sessionStorage.getItem(STUDENT_ID_KEY);
  if (!id) {
    id = uuidv4();
    sessionStorage.setItem(STUDENT_ID_KEY, id);
  }
  return id;
};


export const getStudentName = (): string | null =>
  sessionStorage.getItem(STUDENT_NAME_KEY);

export const setStudentName = (name: string): void =>
  sessionStorage.setItem(STUDENT_NAME_KEY, name);

export const clearStudentSession = (): void => {
  sessionStorage.removeItem(STUDENT_ID_KEY);
  sessionStorage.removeItem(STUDENT_NAME_KEY);
};