import { NextResponse } from "next/server";
import Stripe from "stripe";
import { readyMadeProducts } from "@/data/products";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string || "sk_test_mock", {
  apiVersion: "2026-02-25.clover",
});

export async function POST(req: Request) {
  try {
    const { type, id } = await req.json();
    
    // Automatically determine the host to redirect correctly in Dev and Vercel
    const host = req.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const domain = `${protocol}://${host}`;

    let title = "Custom Puzzle Reveal";
    let price = 899; // $8.99 flat rate

    if (type === "readymade") {
      const product = readyMadeProducts.find(p => p.id === id);
      if (product) {
        title = "Ready-Made: " + product.title;
        price = product.price * 100;
      }
    } else if (type === "seo") {
      title = "Ready-Made Kit: " + id.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
    }

    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === "sk_test_mock") {
      // Mock checkout flow for testing without keys
      return NextResponse.json({ url: `${domain}/success/${id}` });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_creation: "always",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: title,
              description: "Beautiful, printable custom puzzle PDF package.",
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${domain}/success/${id}`,
      cancel_url: `${domain}`,
      metadata: {
        job_id: id
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
