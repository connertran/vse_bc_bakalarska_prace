import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router";
import register from "./register";
import PasswordFields from "./PasswordFields";

function RegisterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    alt_email: "",
    password: "",
    tel_number: "",
    bio: "",
    year_of_study: 0,
  });

  const [errors, setErrors] = useState<string[]>([]);

  function handleChange(
    evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = evt.target;

    setFormData((data) => ({
      ...data,
      [name]: name === "year_of_study" ? Number(value) : value,
    }));
  }

  async function handleSubmit(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    setErrors([]);
    try {
      await register(formData);
      navigate("/");
    } catch (error) {
      setErrors(
        Array.isArray(error) ? error : ["Something went wrong. Try again."],
      );
    }
  }

  return (
    <>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        {errors.map((message) => (
          <p key={message} role="alert">
            {message}
          </p>
        ))}

        <label htmlFor="name">Name: </label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email: </label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="alt_email">Alternative email: </label>
        <input
          id="alt_email"
          type="email"
          name="alt_email"
          value={formData.alt_email}
          onChange={handleChange}
          required
        />

        <PasswordFields password={formData.password} onChange={handleChange} />

        <label htmlFor="tel_number">Telephone number: </label>
        <input
          id="tel_number"
          type="tel"
          name="tel_number"
          minLength={9}
          maxLength={15}
          value={formData.tel_number}
          onChange={handleChange}
          required
        />

        <label htmlFor="year_of_study">Year of study: </label>
        <input
          id="year_of_study"
          type="number"
          name="year_of_study"
          min={1}
          max={5}
          value={formData.year_of_study || ""}
          onChange={handleChange}
          required
        />

        <label htmlFor="bio">Bio: </label>
        <textarea
          id="bio"
          name="bio"
          maxLength={2000}
          value={formData.bio}
          onChange={handleChange}
          required
        />

        <button type="submit">Register</button>
      </form>
    </>
  );
}

export default RegisterForm;
