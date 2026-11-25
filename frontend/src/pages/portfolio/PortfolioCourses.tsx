import { useState } from "react";
import type { UserCourse } from "../../API/types";
import AddCoursePopUp from "./AddCoursePopUp";

type PortfolioCoursesProps = {
  courses: UserCourse[];
  isOwnProfile: boolean;
};

// default # of courses visible
// if user wants to see more, press "Show more"
const COURSES_PREVIEW_COUNT = 4;

function PortfolioCourses({ courses, isOwnProfile }: PortfolioCoursesProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);

  const visibleCourses = isExpanded
    ? courses
    : courses.slice(0, COURSES_PREVIEW_COUNT);
  const hasMore = courses.length > COURSES_PREVIEW_COUNT;

  return (
    <section className="portfolio-courses">
      <div className="portfolio-courses-header">
        <h2>Related Courses</h2>

        {isOwnProfile && (
          <button type="button" onClick={() => setIsPopUpOpen(true)}>
            Add course
          </button>
        )}
      </div>

      {courses.length === 0 && <p>No courses added yet.</p>}

      <div className="portfolio-courses-list">
        {visibleCourses.map((course) => (
          <article key={course.id} className="portfolio-course-card">
            <p>
              {course.name} ({course.course_code})
            </p>
            <span className="portfolio-course-status">
              {course.course_status}
            </span>
          </article>
        ))}
      </div>

      {hasMore && (
        <button
          type="button"
          className="portfolio-courses-more"
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      )}

      {isPopUpOpen && <AddCoursePopUp onClose={() => setIsPopUpOpen(false)} />}
    </section>
  );
}

export default PortfolioCourses;
