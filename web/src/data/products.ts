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
    imageUrl: "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=800&q=80",
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
  },
  {
    id: "puz-elephant",
    title: "African Elephant",
    description: "A gorgeous, textured portrait of a wild elephant that translates beautifully into patterns.",
    price: 10.00,
    imageUrl: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=800&q=80",
    difficulty: "Detailed"
  },
  {
    id: "puz-mountain",
    title: "Alpine Peaks",
    description: "A breathtaking mountain range. The strong contrast makes for a very satisfying puzzle reveal.",
    price: 10.00,
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    difficulty: "Medium"
  },
  {
    id: "puz-flower",
    title: "Blooming Rose",
    description: "An intricate, delicate floral design perfect for framing.",
    price: 10.00,
    imageUrl: "https://images.unsplash.com/photo-1496062031456-07b8f162a322?w=800&q=80",
    difficulty: "Medium"
  },
  {
    id: "puz-eagle",
    title: "Soaring Eagle",
    description: "A fiercely detailed eagle portrait with striking feather patterns.",
    price: 10.00,
    imageUrl: "https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=800&q=80",
    difficulty: "Detailed"
  }
];
