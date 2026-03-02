import React from "react";

export interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  genre: string;
  description: string;
}

interface BookListProps {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
}

const BookList: React.FC<BookListProps> = ({ books, onEdit, onDelete }) => {
  if (books.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
        <p className="text-lg font-semibold text-gray-900">No books in your library</p>
        <p className="mt-1 text-sm text-gray-500">Add your first book to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-6 py-3 font-medium text-gray-500">Title</th>
            <th className="px-6 py-3 font-medium text-gray-500">Author</th>
            <th className="px-6 py-3 font-medium text-gray-500">Genre</th>
            <th className="px-6 py-3 font-medium text-gray-500">Year</th>
            <th className="px-6 py-3 text-right font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id} className="border-b border-gray-100 last:border-b-0">
              <td className="px-6 py-4 font-medium text-gray-900">{book.title}</td>
              <td className="px-6 py-4 text-gray-700">{book.author}</td>
              <td className="px-6 py-4">
                <span className="inline-block rounded bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                  {book.genre}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-700">{book.year}</td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(book)}
                    className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    title="Edit"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(book)}
                    className="rounded p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600"
                    title="Delete"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookList;
