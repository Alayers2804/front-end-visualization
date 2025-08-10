// components/FormInput.tsx
interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  placeholder?: string;
  required?: boolean;
  selectOptions?: { label: string; value: string }[];
  error?: string | null;
  disabled?: boolean; 
  readOnly?: boolean;
}

export default function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  selectOptions,
  disabled = false, 
  readOnly = false,
}: FormInputProps) {
  return (
    <div>
      <label className="block font-medium text-gray-700 mb-1">{label}</label>
      {selectOptions ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className="w-full border border-gray-300 p-3 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
        >
          <option value="">-- Pilih {label} --</option>
          {selectOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled} 
          readOnly={readOnly}
          className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
        />
      )}
    </div>
  );
}
