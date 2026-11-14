import {
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type FormEvent,
} from "react";
import { extractCourses, htmlToMarkdown } from "./extractlink";
import CoursesList from "./CoursesList";
import type { CourseInsertData } from "../../API/types";

type Extraction = { id: number; courses: CourseInsertData[] };

function InsertCoursesPage() {
  const [text, setText] = useState("");
  // store the courses after the extraction
  const [extraction, setExtraction] = useState<Extraction | null>(null);

  function handleChange(evt: ChangeEvent<HTMLTextAreaElement>) {
    setText(evt.target.value);
  }

  // The pasted text from INSIS should contain links (extract everything...)
  function handlePaste(evt: ClipboardEvent<HTMLTextAreaElement>) {
    const html = evt.clipboardData.getData("text/html");
    // with text no links, let the browser handle
    if (!html) return;

    evt.preventDefault();
    const markdown = htmlToMarkdown(html);
    const { selectionStart, selectionEnd } = evt.currentTarget;

    setText(
      (prev) =>
        prev.slice(0, selectionStart) + markdown + prev.slice(selectionEnd),
    );
  }

  function handleSubmit(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    // use the date value for the unique id
    // new id after every extraction
    // rerender the state... the CoursesList component will rerender with the new id
    setExtraction({ id: Date.now(), courses: extractCourses(text) });
  }

  return (
    <>
      <h1>Insert courses</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="courses-text">Paste course text: </label>
        <textarea
          id="courses-text"
          name="courses-text"
          rows={20}
          cols={120}
          value={text}
          onChange={handleChange}
          onPaste={handlePaste}
          required
        />
        <button type="submit">Extract</button>
      </form>

      {extraction &&
        (extraction.courses.length > 0 ? (
          <CoursesList key={extraction.id} courses={extraction.courses} />
        ) : (
          <p role="status">No courses found!</p>
        ))}
    </>
  );
}

export default InsertCoursesPage;
