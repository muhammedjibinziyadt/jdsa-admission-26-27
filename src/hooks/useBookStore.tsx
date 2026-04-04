import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Book {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  active: boolean;
  created_at: string;
}

export interface BookOrder {
  id: string;
  book_id: string | null;
  book_name: string;
  customer_name: string;
  phone: string;
  address: string;
  payment_screenshot_url: string | null;
  status: string;
  created_at: string;
}

export function useBookStore() {
  const [books, setBooks] = useState<Book[]>([]);
  const [orders, setOrders] = useState<BookOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBooks = async () => {
    const { data, error } = await supabase.from('books').select('*').order('created_at', { ascending: false });
    if (!error) setBooks(data as Book[]);
    setLoading(false);
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase.from('book_orders').select('*').order('created_at', { ascending: false });
    if (!error) setOrders(data as BookOrder[]);
  };

  useEffect(() => { fetchBooks(); fetchOrders(); }, []);

  const addBook = async (book: { name: string; price: number; image_url?: string | null }) => {
    const { error } = await supabase.from('books').insert(book);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return false; }
    toast({ title: 'Book added' });
    fetchBooks();
    return true;
  };

  const updateBook = async (id: string, updates: Partial<Book>) => {
    const { error } = await supabase.from('books').update(updates).eq('id', id);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return false; }
    toast({ title: 'Book updated' });
    fetchBooks();
    return true;
  };

  const deleteBook = async (id: string) => {
    const { error } = await supabase.from('books').delete().eq('id', id);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return false; }
    toast({ title: 'Book deleted' });
    fetchBooks();
    return true;
  };

  const placeOrder = async (order: { book_id: string; book_name: string; customer_name: string; phone: string; address: string; payment_screenshot_url?: string | null }) => {
    const { error } = await supabase.from('book_orders').insert(order);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return false; }
    toast({ title: 'Order placed successfully!' });
    return true;
  };

  const uploadBookImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split('.').pop();
    const path = `books/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('bookstore').upload(path, file);
    if (error) { toast({ title: 'Upload error', description: error.message, variant: 'destructive' }); return null; }
    const { data } = supabase.storage.from('bookstore').getPublicUrl(path);
    return data.publicUrl;
  };

  const uploadPaymentScreenshot = async (file: File): Promise<string | null> => {
    const ext = file.name.split('.').pop();
    const path = `payments/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('bookstore').upload(path, file);
    if (error) { toast({ title: 'Upload error', description: error.message, variant: 'destructive' }); return null; }
    const { data } = supabase.storage.from('bookstore').getPublicUrl(path);
    return data.publicUrl;
  };

  const deleteOrder = async (id: string) => {
    const { error } = await supabase.from('book_orders').delete().eq('id', id);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return false; }
    toast({ title: 'Order deleted' });
    fetchOrders();
    return true;
  };

  return { books, orders, loading, addBook, updateBook, deleteBook, placeOrder, uploadBookImage, uploadPaymentScreenshot, deleteOrder, refetchBooks: fetchBooks, refetchOrders: fetchOrders };
}
