-- Seed data for the tutoring database.

INSERT INTO university (name, email_domain)
SELECT 'VSE', 'vse.cz'
WHERE NOT EXISTS (
  SELECT 1
  FROM university
  WHERE name = 'VSE'
    AND email_domain = 'vse.cz'
);
