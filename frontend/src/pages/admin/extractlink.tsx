type ExtractedCourse = {
  code: string;
  name: string;
  semester: string;
  faculty: string;
  url: string;
};

function extractCourses(text: string): ExtractedCourse[] {
  const regex =
    /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)\s*-\s*((?:WS|SS)\s+\d{4}\/\d{4})\s*-\s*([^\r\n\\]+)/g;

  return Array.from(text.matchAll(regex), (match) => {
    // Groups 1-4 always exist when the regex matches.
    const [, fullName, url, semester, faculty] = match;

    // The first word is the course code
    const [code, ...nameParts] = fullName.trim().split(/\s+/);

    return {
      code,
      name: nameParts.join(" "),
      semester,
      faculty: faculty.trim(),
      url,
    };
  });
}

const BLOCK_SELECTOR = "p, div, li, tr, h1, h2, h3, h4, h5, h6, ul, ol, table";

function htmlToMarkdown(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const body = doc.body;

  // remove multiple spaces
  const walker = doc.createTreeWalker(body, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode())
    node.textContent = (node.textContent ?? "").replace(/\s+/g, " ");

  // replace links with markdown, keep the raw href
  body.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((link) => {
    const name = (link.textContent ?? "").trim();
    const url = link.getAttribute("href") ?? "";
    link.replaceWith(`[${name}](${url})`);
  });

  // <br> means "\n" in markdown
  body.querySelectorAll("br").forEach((br) => br.replaceWith("\n"));
  body.querySelectorAll(BLOCK_SELECTOR).forEach((el) => el.append("\n"));

  // remove empty lines
  return (body.textContent ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
}

export { extractCourses, htmlToMarkdown };
