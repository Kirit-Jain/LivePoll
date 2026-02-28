import { useState } from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { RoleSelect } from "@/components/roleSelect";
import StudentView from "@/components/student/studentView";
import TeacherView from "@/components/teacher/teacherView";
import type { UserRole } from "@/types/poll.types";

const AppInner = () => {
  const [role, setRole] = useState<UserRole | null>(null);

  if (!role) return <RoleSelect onSelect={setRole} />;
  
  return role === "teacher" ? <TeacherView /> : <StudentView />;
};

export default function App() {
  return (
    <Provider store={store}>
      <AppInner />
    </Provider>
  );
}