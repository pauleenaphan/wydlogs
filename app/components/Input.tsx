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
        className='rounded-lg border-2 border-pastel-stroke bg-card px-3 py-2 text-pastel-ink transition-colors placeholder:text-pastel-ink/40 hover:border-pastel-lilac-hover focus-visible:border-pastel-lilac-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pastel-lilac/35'
        placeholder={placeholder}
      />
    </div>
  );
}
