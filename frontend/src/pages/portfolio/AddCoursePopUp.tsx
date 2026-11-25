import { useEffect, useRef, useState, type FormEvent } from "react";
import API from "../../API/api";
import type { CourseSearchBy, CourseSearchResult } from "../../API/types";
import "./AddCoursePopUp.css";

type AddCoursePopUpProps = {
  onClose: () => void;
};

// defualt delay for autocomplete search deboucing
const SEARCH_DEBOUNCE_MS = 500;

type SearchResponse = {
  key: string;
  courses: CourseSearchResult[];
  error: string | null;
};

function AddCoursePopUp({ onClose }: AddCoursePopUpProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [inputValue, setInputValue] = useState(""); // search bar value
  const [searchText, setSearchText] = useState(""); // value sent to the backend
  const [searchBy, setSearchBy] = useState<CourseSearchBy>("code");
  const [response, setResponse] = useState<SearchResponse | null>(null);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  // debouncing: update searchText only after the user paused typing
  useEffect(() => {
    const timeoutId = setTimeout(
      () => setSearchText(inputValue),
      SEARCH_DEBOUNCE_MS,
    );
    // clean up function: if the user types again reset the timer
    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  const requestKey = `${searchBy}:${searchText}`;
  useEffect(() => {
    // if the user types again before the request is completly fetched -> cancel the request
    let isCancelled = false;

    async function loadCourses() {
      try {
        const courses = await API.searchCourses(searchText, searchBy);
        if (!isCancelled)
          setResponse({ key: requestKey, courses, error: null });
      } catch (err) {
        if (!isCancelled)
          setResponse({
            key: requestKey,
            courses: [],
            error: Array.isArray(err) ? err.join(", ") : "Request failed",
          });
      }
    }

    loadCourses();
    return () => {
      isCancelled = true;
    };
  }, [searchText, searchBy, requestKey]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSearchText(inputValue);
  }

  const isLoading = response?.key !== requestKey;

  return (
    <dialog
      ref={dialogRef}
      className="add-course-popup"
      onClose={onClose}
      onClick={(e) => e.target === dialogRef.current && onClose()}
    >
      <div className="add-course-popup-header">
        <h3>Add a course</h3>
        <button type="button" onClick={onClose} aria-label="Close">
          X
        </button>
      </div>

      <form className="add-course-search" onSubmit={handleSubmit}>
        <div className="add-course-search-bar">
          <input
            type="search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              searchBy === "code"
                ? "Search by course code"
                : "Search by course name"
            }
            aria-label="Search courses"
            maxLength={155}
            autoFocus
          />
          <button type="submit">Search</button>
        </div>

        {/* toggle switch: off: search by code, on: search by name */}
        <label className="add-course-switch">
          <span className={searchBy === "code" ? "is-active" : ""}>Code</span>
          <input
            type="checkbox"
            role="switch"
            checked={searchBy === "name"}
            onChange={(e) => setSearchBy(e.target.checked ? "name" : "code")}
          />
          <span className="add-course-switch-track" aria-hidden="true" />
          <span className={searchBy === "name" ? "is-active" : ""}>Name</span>
        </label>
      </form>

      <div className="add-course-results" aria-live="polite">
        {response?.error && <p role="alert">{response.error}</p>}
        {isLoading && <p>Loading...</p>}
        {!isLoading && !response?.error && response?.courses.length === 0 && (
          <p>No courses found.</p>
        )}

        <ul className="add-course-list">
          {response?.courses.map((course) => (
            <li key={course.id} className="add-course-item">
              <strong>{course.name}</strong>
              <span>
                {course.course_code}
                {course.description && ` - ${course.description}`}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </dialog>
  );
}

export default AddCoursePopUp;
