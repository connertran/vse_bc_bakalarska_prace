import {
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type FormEvent,
} from "react";
import { extractCourses, htmlToMarkdown } from "./extractlink";

function InsertCoursesPage() {
  const [text, setText] = useState("");

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
    const courses = extractCourses(text);
    console.log(courses);
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
    </>
  );
}

export default InsertCoursesPage;
