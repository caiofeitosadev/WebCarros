import {
  type RegisterOptions,
  type UseFormRegister,
  type Path,
  type FieldValues,
} from 'react-hook-form';

interface InputProps<T extends FieldValues> {
  type: string;
  placeholder: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: string;
  rules?: RegisterOptions<T>;
}

export function Input<T extends FieldValues>({
  name,
  placeholder,
  type,
  register,
  error,
  rules,
}: InputProps<T>) {
  return (
    <div className="w-full mb-5">
      <input
        {...register(name, rules)}
        className="w-full border border-gray-200 rounded-sm px-5 py-4 outline-0"
        placeholder={placeholder}
        type={type}
        id={name}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
