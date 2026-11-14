import type { CourseStatus } from "./CoursesList";
function StatusCourse({ status }: { status: CourseStatus }) {
  if (status.state === "added") return <span>Added</span>;
  if (status.state === "inserting") return <span>Inserting...</span>;
  if (status.state === "failed") return <span>Failed: {status.message}</span>;
  return <span>Not inserted yet</span>;
}
export default StatusCourse;
