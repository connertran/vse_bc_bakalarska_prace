-- Seed data for the tutoring database.

INSERT INTO university (name, email_domain)
SELECT 'VSE', 'vse.cz'
WHERE NOT EXISTS (
  SELECT 1
  FROM university
  WHERE name = 'VSE'
    AND email_domain = 'vse.cz'
);

-- Adding faculty FIS of VSE university to the DB
INSERT INTO faculty (name, university_ID)
SELECT 'FIS', university.ID
FROM university
WHERE university.name = 'VSE'
  AND NOT EXISTS (
    SELECT 1
    FROM faculty
    WHERE faculty.name = 'FIS'
      AND faculty.university_ID = university.ID
  );


INSERT INTO field_of_study (name, faculty_ID)
SELECT 'Aplikovaná informatika', faculty.ID
FROM faculty
JOIN university ON university.ID = faculty.university_ID
WHERE faculty.name = 'FIS'
  AND university.name = 'VSE'
  AND NOT EXISTS (
    SELECT 1
    FROM field_of_study
    WHERE field_of_study.name = 'Aplikovaná informatika'
      AND field_of_study.faculty_ID = faculty.ID
  );
