import axios, { AxiosError } from "axios";
import { Book } from "../components/BookList";

const API_URL = "http://localhost:5217/api/books";

export interface BookPayload {
  title: string;
  author: string;
  year: number;
  genre: string;
  description: string;
}

/** Extracts a user-readable message from an Axios error, falling back to a default. */
const extractMessage = (err: unknown, fallback: string): string => {
  const axiosErr = err as AxiosError<{ message?: string }>;
  return axiosErr?.response?.data?.message ?? fallback;
};

export const getBooks = async (): Promise<Book[]> => {
  const response = await axios.get<Book[]>(API_URL);
  return response.data;
};

export const getBook = async (id: number): Promise<Book> => {
  const response = await axios.get<Book>(`${API_URL}/${id}`);
  return response.data;
};

export const addBook = async (book: BookPayload): Promise<Book> => {
  try {
    const response = await axios.post<Book>(API_URL, book);
    return response.data;
  } catch (err) {
    throw new Error(extractMessage(err, "Failed to add book. Please try again."));
  }
};

export const editBook = async (id: number, book: BookPayload & { id: number }): Promise<void> => {
  try {
    await axios.put(`${API_URL}/${id}`, book);
  } catch (err) {
    throw new Error(extractMessage(err, "Failed to update book. Please try again."));
  }
};

export const deleteBook = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};