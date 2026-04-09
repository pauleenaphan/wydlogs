export default function Input({
  label,
  name,
  defaultValue,
  required,
  inputId,
  placeholder
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  inputId?: string;
  placeholder?: string;
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
        placeholder={placeholder}
      />
    </div>
  );
}
