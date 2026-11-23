import { useState } from "react";
import type { UserCourse } from "../../API/types";

type PortfolioCoursesProps = {
  courses: UserCourse[];
};

// default # of courses visible
// if user wants to see more, press "Show more"
const COURSES_PREVIEW_COUNT = 4;

function PortfolioCourses({ courses }: PortfolioCoursesProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleCourses = isExpanded
    ? courses
    : courses.slice(0, COURSES_PREVIEW_COUNT);
  const hasMore = courses.length > COURSES_PREVIEW_COUNT;

  return (
    <section className="portfolio-courses">
      <h2>Related Courses</h2>

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
    </section>
  );
}

export default PortfolioCourses;
