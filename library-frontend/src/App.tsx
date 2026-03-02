import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import BookList, { Book } from "./components/BookList";
import BookForm, { BookFormData } from "./components/BookForm";
import DeleteConfirmation from "./components/DeleteConfirmation";
import { getBooks, addBook, editBook, deleteBook } from "./services/bookService";

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);

  const fetchBooks = async () => {
    try {
      const data = await getBooks();
      setBooks(data);
    } catch (error) {
      console.error("Failed to fetch books:", error);
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
    try {
      if (editingBook) {
        await editBook(editingBook.id, { ...data, id: editingBook.id });
      } else {
        await addBook(data);
      }
      setIsFormOpen(false);
      setEditingBook(null);
      fetchBooks();
    } catch (error) {
      console.error("Failed to save book:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingBook) return;
    try {
      await deleteBook(deletingBook.id);
      setIsDeleteOpen(false);
      setDeletingBook(null);
      fetchBooks();
    } catch (error) {
      console.error("Failed to delete book:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">My Library</h2>
            <p className="mt-1 text-sm text-gray-500">
              Total books: {books.length}
            </p>
          </div>
          <button
            onClick={handleAddClick}
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
    </div>
  );
};

export default App;