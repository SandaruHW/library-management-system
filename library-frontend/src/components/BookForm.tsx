import React, { useState, useEffect } from "react";
import { Book } from "./BookList";

export interface BookFormData {
  title: string;
  author: string;
  year: number;
  genre: string;
  description: string;
}

interface FormErrors {
  title?: string;
  author?: string;
  year?: string;
  genre?: string;
}

interface BookFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: BookFormData) => void;
  initialData?: Book | null;
}

const GENRES = [
  "Fiction", "Non-Fiction", "Science Fiction", "Fantasy", "Mystery",
  "Thriller", "Biography", "History", "Science", "Technology",
  "Self-Help", "Romance", "Horror", "Children's", "Poetry", "Drama", "Other",
];

const inputBase =
  "mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-1";
const inputNormal = `${inputBase} border-gray-300 focus:border-indigo-500 focus:ring-indigo-500`;
const inputError  = `${inputBase} border-red-400 focus:border-red-500 focus:ring-red-500`;

const FieldError: React.FC<{ message?: string }> = ({ message }) =>
  message ? <p className="mt-1 text-xs text-red-500">{message}</p> : null;

const BookForm: React.FC<BookFormProps> = ({ open, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<BookFormData>({
    title: "",
    author: "",
    year: new Date().getFullYear(),
    genre: "",
    description: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        author: initialData.author,
        year: initialData.year,
        genre: initialData.genre,
        description: initialData.description,
      });
    } else {
      setFormData({
        title: "",
        author: "",
        year: new Date().getFullYear(),
        genre: "",
        description: "",
      });
    }
    setErrors({});
  }, [initialData, open]);

  const validate = (data: BookFormData): FormErrors => {
    const errs: FormErrors = {};
    if (!data.title.trim())
      errs.title = "Title is required.";
    else if (data.title.trim().length > 200)
      errs.title = "Title cannot exceed 200 characters.";

    if (!data.author.trim())
      errs.author = "Author is required.";
    else if (data.author.trim().length > 100)
      errs.author = "Author cannot exceed 100 characters.";

    if (!data.year)
      errs.year = "Year is required.";
    else if (data.year < 1000 || data.year > 2100)
      errs.year = "Year must be between 1000 and 2100.";

    if (!data.genre)
      errs.genre = "Genre is required.";

    return errs;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updated = {
      ...formData,
      [name]: name === "year" ? parseInt(value) || 0 : value,
    };
    setFormData(updated);
    // Clear the error for this field as the user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(formData);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit(formData);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Dialog */}
      <div className="relative z-50 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {initialData ? "Edit Book" : "Add New Book"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {initialData
                ? "Update the book details below."
                : "Fill in the details of the new book to add it to your library."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter book title"
              className={errors.title ? inputError : inputNormal}
            />
            <FieldError message={errors.title} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Author</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Enter author name"
              className={errors.author ? inputError : inputNormal}
            />
            <FieldError message={errors.author} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Year</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                placeholder="Enter year"
                className={errors.year ? inputError : inputNormal}
              />
              <FieldError message={errors.year} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Genre</label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className={errors.genre ? inputError : inputNormal}
              >
                <option value="" disabled>Select genre</option>
                {GENRES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              <FieldError message={errors.genre} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter book description"
              rows={3}
              className={`${inputNormal} resize-none`}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              {initialData ? "Update Book" : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookForm;
