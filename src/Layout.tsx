import { FormEvent, HTMLProps, ReactNode, useId, useState } from "react";
import { zfd } from "zod-form-data";
import { z } from "zod";

const schema = zfd.formData({
  fname: zfd.text(z.string().min(5, { message: "Must have 5 characters" })),
  lname: zfd.text(z.string().optional()),
  password: zfd.text(z.string().min(5, { message: "Must have 5 characters" })),
  gradAge: zfd.numeric(),
  address: zfd.text(),
  qualification: zfd.text(),
  gender: zfd.text(),
  isAdult: zfd.checkbox(),
  courses: zfd.repeatableOfType(zfd.text()),
});

// type FormObjType = z.infer<typeof schema>

export const Layout = () => {
  const formId = useId();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // for (const [key, value] of formData) {
    //   console.log(`${key}: ${value}`);
    // }

    const obj = schema.safeParse(formData);
    if (obj.success) {
      console.log(obj.data);
      setFieldErrors({});
    } else {
      const allErrors = obj.error.formErrors.fieldErrors;
      console.log(allErrors);
      setFieldErrors(allErrors);
      const firstErrorField = form.querySelector(
        `[name='${Object.keys(allErrors)[0]}']`
      ) as HTMLFormElement;

      if (firstErrorField) firstErrorField.focus();
    }
  };

  return (
    <div className="stack">
      <h1>Register</h1>

      <form className="stack" onSubmit={handleSubmit} autoComplete="off">
        <InputField
          id={`${formId}-fname`}
          name="fname"
          label="First Name"
          required
          error={fieldErrors["fname"]?.toString()}
        />
        <InputField id={`${formId}-lname`} name="lname" label="Last Name" />
        <InputField
          id={`${formId}-password`}
          name="password"
          label="Password"
          type="password"
          required
          error={fieldErrors["password"]?.toString()}
        />
        <InputField
          id={`${formId}-gradAge`}
          name="gradAge"
          label="Graduation Age"
          type="number"
          required
          min={16}
          max={32}
        />
        <div className="fgroup">
          <label htmlFor={`${formId}-address`}>Address</label>
          <textarea
            id={`${formId}-address`}
            rows={3}
            name="address"
            required
          ></textarea>
        </div>
        <div className="fgroup">
          <label htmlFor={`${formId}-qualification`}>
            Highest Qualification
          </label>
          <select
            id={`${formId}-qualification`}
            name="qualification"
            defaultValue="novalue"
          >
            <option value="novalue" disabled>
              Please Select
            </option>
            <option value="graduation">Graduation</option>
            <option value="post-grad">Post Grad</option>
            <option value="phd">PHD</option>
          </select>
        </div>
        <div className="fgroup inline">
          <label>Gender</label>
          {["Male", "Female", "Transgender"].map((field) => (
            <InputField
              key={field}
              id={`${formId}-${field}`}
              type="radio"
              label={field}
              name="gender"
              value={field.toLowerCase()}
              inline
            />
          ))}
        </div>
        <div className="fgroup inline">
          <label>Courses</label>
          {["HTML", "CSS", "Javascript"].map((field) => (
            <InputField
              key={field}
              id={`${formId}-${field}`}
              type="checkbox"
              label={field}
              name="courses"
              value={field.toLowerCase()}
              inline
            />
          ))}
        </div>
        <div className="fgroup inline">
          <label htmlFor="adult">Age Above 18?</label>
          <input type="checkbox" name="isAdult" id="adult" />
        </div>
        <button type="submit">Submit</button>
        <button type="reset" onClick={() => setFieldErrors({})}>
          Reset
        </button>
      </form>
    </div>
  );
};

type InputFieldProps = HTMLProps<HTMLInputElement> & {
  id: string;
  label: ReactNode;
  inline?: boolean;
  error?: string;
};

const InputField = ({
  id,
  label,
  inline,
  error,
  ...props
}: InputFieldProps) => {
  return (
    <div className={["fgroup", inline ? "infield" : ""].join(" ")}>
      <label htmlFor={id}>{label}</label>
      <input id={id} {...props} />
      {error && !inline ? <p>{error}</p> : <></>}
    </div>
  );
};
