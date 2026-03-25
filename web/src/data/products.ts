import { landingPages } from "./landingPages";

export interface Product {
  id: string; // The slug
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  difficulty: "Easy" | "Medium" | "Detailed";
}

// Transform the first 8 immersive SEO landing pages directly into Homepage Product Cards
// This brilliantly unifies the UX so users click a card and enter an immersive product journey
export const readyMadeProducts: Product[] = landingPages.slice(0, 8).map((page, index) => {
  // Cycle through difficulties just for display variation
  const diffCycle: ("Easy"|"Medium"|"Detailed")[] = ["Easy", "Medium", "Detailed"];
  const diff = diffCycle[index % 3];
  
  // Format the title nicely by stripping off generic SEO postfixes
  let formattedTitle = page.h1.split(":")[0]; 
  if (formattedTitle.length > 30) {
     formattedTitle = page.headline.split(",")[0].replace(" Dot by Dot", "");
  }

  return {
    id: page.slug,
    title: formattedTitle,
    description: page.shortDescription || "A beautiful relaxing hobby kit.",
    price: 8.99,
    imageUrl: page.unsplashUrl || page.imageUrl || "",
    difficulty: diff
  };
});
