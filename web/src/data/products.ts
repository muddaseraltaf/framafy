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
    price: 10.00,
    imageUrl: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&q=80",
    difficulty: "Detailed"
  },
  {
    id: "puz-architecture",
    title: "Tokyo Street",
    description: "Re-create a stunning urban cityscape dot by dot. A beautiful weekend activity.",
    price: 10.00,
    imageUrl: "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&q=80",
    difficulty: "Medium"
  },
  {
    id: "puz-cat",
    title: "Curious Cat",
    description: "A relaxing, fun puzzle featuring a curious kitten. Great for kids and adults.",
    price: 10.00,
    imageUrl: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&q=80",
    difficulty: "Easy"
  },
  {
    id: "puz-pug",
    title: "Playful Pug",
    description: "An adorable pug portrait. A perfect quick project that leaves you with a cute drawing.",
    price: 10.00,
    imageUrl: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&q=80",
    difficulty: "Easy"
  }
];
