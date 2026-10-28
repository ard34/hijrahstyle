'use client';

import { create } from 'zustand';

interface CartItemType {
  id: string;
  productVariantId: string;
  productName: string;
  variantLabel: string;
  price: number;
  quantity: number;
  imageUrl: string;
  stock: number;
}

interface CartStore {
  items: CartItemType[];
  isOpen: boolean;
  setItems: (items: CartItemType[]) => void;
  addItem: (item: CartItemType) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  setItems: (items) => set({ items }),
  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.productVariantId === item.productVariantId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productVariantId === item.productVariantId
              ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock) }
              : i
          ),
        };
      }
      return { items: [...state.items, item] };
    }),
  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
    })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),
  clearCart: () => set({ items: [] }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
}));

interface ToastType {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface ToastStore {
  toasts: ToastType[];
  addToast: (message: string, type?: ToastType['type']) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, type = 'success') => {
    const id = Math.random().toString(36).substring(2);
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

interface UserType {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
}

interface AuthStore {
  user: UserType | null;
  isLoading: boolean;
  setUser: (user: UserType | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null }),
}));
