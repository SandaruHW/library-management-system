import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import BookList, { Book } from "./components/BookList";
import BookForm, { BookFormData } from "./components/BookForm";
import DeleteConfirmation from "./components/DeleteConfirmation";
import { getBooks, addBook, editBook, deleteBook } from "./services/bookService";

// Error toast shown in the top-right corner, auto-dismisses after 5 seconds
const ErrorToast: React.FC<{ message: string; onDismiss: () => void }> = ({ message, onDismiss }) => (
  <div className="fixed z-50 flex items-center max-w-sm gap-3 px-5 py-3 border border-red-200 rounded-lg shadow-lg bottom-8 left-8 bg-red-50">
    <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
    <span className="text-sm font-medium text-red-700">{message}</span>
    <button onClick={onDismiss} className="ml-2 text-red-400 hover:text-red-600">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
);

const BooksPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Auto-dismiss the error toast after 5 seconds
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(null), 5000);
    return () => clearTimeout(timer);
  }, [error]);

  const fetchBooks = async () => {
    try {
      const data = await getBooks();
      setBooks(data);
    } catch (err) {
      console.error("Failed to fetch books:", err);
      setError("Failed to load books. Please check that the API is running.");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddClick = () => {
    setEditingBook(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (book: Book) => {
    setEditingBook(book);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (book: Book) => {
    setDeletingBook(book);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (data: BookFormData) => {
    // Client-side duplicate guard: same title + author + year + genre (case-insensitive), excluding the book being edited
    const isDuplicate = books.some(
      (b) =>
        b.title.toLowerCase() === data.title.trim().toLowerCase() &&
        b.author.toLowerCase() === data.author.trim().toLowerCase() &&
        b.year === data.year &&
        b.genre.toLowerCase() === data.genre.toLowerCase() &&
        b.id !== editingBook?.id
    );
    if (isDuplicate) {
      setError(`"${data.title}" by ${data.author} (${data.year}, ${data.genre}) already exists.`);
      return;
    }

    try {
      if (editingBook) {
        await editBook(editingBook.id, { ...data, id: editingBook.id });
      } else {
        await addBook(data);
      }
      setIsFormOpen(false);
      setEditingBook(null);
      fetchBooks();
    } catch (err) {
      console.error("Failed to save book:", err);
      setError(err instanceof Error ? err.message : editingBook ? "Failed to update book." : "Failed to add book.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingBook) return;
    try {
      await deleteBook(deletingBook.id);
      setIsDeleteOpen(false);
      setDeletingBook(null);
      fetchBooks();
    } catch (err) {
      console.error("Failed to delete book:", err);
      setError("Failed to delete book. Please try again.");
    }
  };

  return (
    <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      {/* Error Toast */}
      {error && <ErrorToast message={error} onDismiss={() => setError(null)} />}

      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">My Library</h2>
          <p className="mt-1 text-sm text-gray-500">
            Total books: {books.length}
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Book
        </button>
      </div>

      {/* Book Table */}
      <BookList books={books} onEdit={handleEditClick} onDelete={handleDeleteClick} />

      {/* Add/Edit Modal */}
      <BookForm
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingBook(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingBook}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingBook(null);
        }}
        onConfirm={handleDeleteConfirm}
        book={deletingBook}
      />
    </main>
  );
};

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/books" element={<BooksPage />} />
        <Route path="/" element={<Navigate to="/books" replace />} />
        <Route path="*" element={<Navigate to="/books" replace />} />
      </Routes>
    </div>
  );
};

export default App;