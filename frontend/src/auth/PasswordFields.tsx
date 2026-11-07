import { useRef, useState, type ChangeEvent } from "react";

type PasswordFieldsProps = {
  password: string;
  onChange: (evt: ChangeEvent<HTMLInputElement>) => void;
};

// This component checks if the passwords match
function PasswordFields({ password, onChange }: PasswordFieldsProps) {
  const [retypedPassword, setRetypedPassword] = useState("");
  const retypeInputRef = useRef<HTMLInputElement>(null);

  const isMismatch = retypedPassword !== "" && retypedPassword !== password;

  function updateValidity(newPassword: string, newRetyped: string) {
    retypeInputRef.current?.setCustomValidity(
      newRetyped !== newPassword ? "Passwords do not match." : "",
    );
  }

  function handlePasswordChange(evt: ChangeEvent<HTMLInputElement>) {
    onChange(evt);
    updateValidity(evt.target.value, retypedPassword);
  }

  function handleRetypeChange(evt: ChangeEvent<HTMLInputElement>) {
    setRetypedPassword(evt.target.value);
    updateValidity(password, evt.target.value);
  }

  return (
    <>
      <label htmlFor="password">Password: </label>
      <input
        id="password"
        type="password"
        name="password"
        minLength={8}
        value={password}
        onChange={handlePasswordChange}
        required
      />

      <label htmlFor="retype_password">Retype password: </label>
      <input
        id="retype_password"
        ref={retypeInputRef}
        type="password"
        name="retype_password"
        value={retypedPassword}
        onChange={handleRetypeChange}
        required
      />

      {isMismatch && <p role="alert">Passwords do not match.</p>}
    </>
  );
}

export default PasswordFields;
