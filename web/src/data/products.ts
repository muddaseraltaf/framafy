export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  difficulty: "Easy" | "Medium" | "Detailed";
}

export const readyMadeProducts: Product[] = [
  {
    id: "puz-lion",
    title: "Majestic Lion",
    description: "A classic pattern challenge. Perfect for advanced puzzlers looking for stunning wall art.",
    price: 4.99,
    imageUrl: "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?auto=format&fit=crop&q=80&w=800",
    difficulty: "Detailed"
  },
  {
    id: "puz-mona",
    title: "The Mona Lisa",
    description: "Re-create Da Vinci's masterpiece dot by dot. A beautiful weekend activity.",
    price: 4.99,
    imageUrl: "https://images.unsplash.com/photo-1578308422756-3bb1ddc3a0df?auto=format&fit=crop&q=80&w=800",
    difficulty: "Medium"
  },
  {
    id: "puz-cow",
    title: "Highland Cow",
    description: "A relaxing, fun puzzle featuring a fluffy highland cow. Great for kids and adults.",
    price: 3.99,
    imageUrl: "https://images.unsplash.com/photo-1544837851-d30d9fb881b2?auto=format&fit=crop&q=80&w=800",
    difficulty: "Easy"
  },
  {
    id: "puz-pug",
    title: "Playful Pug",
    description: "An adorable pug portrait. A perfect quick project that leaves you with a cute drawing.",
    price: 3.99,
    imageUrl: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=800",
    difficulty: "Easy"
  }
];
