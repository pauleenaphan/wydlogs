export default function Input({
  label,
  name,
  defaultValue,
  required,
  inputId,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  /** Avoid duplicate DOM ids when several inputs share the same `name`. */
  inputId?: string;
}) {
  const id = inputId ?? name;
  return (
    <div className='flex gap-2 flex-col'>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type='text'
        defaultValue={defaultValue}
        required={required}
        className='border-2 rounded-lg px-3 py-2'
      />
    </div>
  );
}
