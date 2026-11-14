import { useState } from "react";
import API from "../../API/api";
import type { CourseInsertData } from "../../API/types";
import "./CourseList.css";
import StatusCourse from "./StatusCourse";

export type CourseStatus = {
  state: "pending" | "inserting" | "added" | "failed";
  message?: string; // error message
};

type CoursesListProps = {
  courses: CourseInsertData[];
};

function CoursesList({ courses }: CoursesListProps) {
  // one status per course, same order as the courses
  const [statuses, setStatuses] = useState<CourseStatus[]>(
    courses.map(() => ({ state: "pending" })),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addedCount = statuses.filter((s) => s.state === "added").length;
  const failedCount = statuses.filter((s) => s.state === "failed").length;
  const isAllAdded = addedCount === courses.length;

  //find the course with the given index and set its status
  function setStatusAt(index: number, status: CourseStatus) {
    setStatuses((prevStatuses) =>
      prevStatuses.map((prevStatus, prevIndex) => {
        if (prevIndex === index) return status;
        return prevStatus;
      }),
    );
  }

  // if the user resubmit the function would skip added courses
  async function handleInsert() {
    setIsSubmitting(true);
    try {
      for (const [index, course] of courses.entries()) {
        if (statuses[index].state === "added") continue;

        setStatusAt(index, { state: "inserting" });
        try {
          await API.insertCourse(course);
          setStatusAt(index, { state: "added" });
        } catch (error) {
          setStatusAt(index, {
            state: "failed",
            message: Array.isArray(error) ? error.join(", ") : "Request failed",
          });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function getButtonLabel() {
    if (isSubmitting) return "Inserting...";
    return failedCount > 0 ? "Retry" : "Insert";
  }

  return (
    <section className="courses-list">
      <h2>Check the courses before inserting</h2>
      <p>
        {courses.length} courses found, {addedCount} added, {failedCount}{" "}
        failed.
      </p>

      <table className="courses-list-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Semester</th>
            <th>Faculty</th>
            <th>Syllabus</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course, index) => (
            <tr key={`${course.code}-${course.semester}-${index}`}>
              <td>{course.code}</td>
              <td>{course.name}</td>
              <td>{course.semester}</td>
              <td>{course.faculty}</td>
              <td>
                <a href={course.url} target="_blank" rel="noopener noreferrer">
                  Open
                </a>
              </td>
              <td>
                <StatusCourse status={statuses[index]} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        type="button"
        onClick={handleInsert}
        disabled={isSubmitting || isAllAdded}
      >
        {getButtonLabel()}
      </button>
    </section>
  );
}

export default CoursesList;
