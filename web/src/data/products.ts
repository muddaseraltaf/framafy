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
    title: "Gothic Architecture",
    description: "Re-create a stunning gothic facade dot by dot. A beautiful weekend activity.",
    price: 10.00,
    imageUrl: "https://images.unsplash.com/photo-1548625361-ec849204fb98?w=800&q=80",
    difficulty: "Medium"
  },
  {
    id: "puz-cow",
    title: "Highland Cow",
    description: "A relaxing, fun puzzle featuring a fluffy highland cow. Great for kids and adults.",
    price: 10.00,
    imageUrl: "https://images.unsplash.com/photo-1564883955572-c23631f47833?w=800&q=80",
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
