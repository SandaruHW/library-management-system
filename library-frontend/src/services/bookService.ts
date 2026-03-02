import axios from "axios";
import { Book } from "../components/BookList";

const API_URL = "http://localhost:5217/api/books";

export interface BookPayload {
  title: string;
  author: string;
  isbn: string;
  year: number;
  genre: string;
  description: string;
}

export const getBooks = async (): Promise<Book[]> => {
  const response = await axios.get<Book[]>(API_URL);
  return response.data;
};

export const getBook = async (id: number): Promise<Book> => {
  const response = await axios.get<Book>(`${API_URL}/${id}`);
  return response.data;
};

export const addBook = async (book: BookPayload): Promise<Book> => {
  const response = await axios.post<Book>(API_URL, book);
  return response.data;
};

export const editBook = async (id: number, book: BookPayload & { id: number }): Promise<void> => {
  await axios.put(`${API_URL}/${id}`, book);
};

export const deleteBook = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};