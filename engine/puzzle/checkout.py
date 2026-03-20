import stripe
import os
from fastapi import HTTPException
from typing import Optional

stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "sk_test_placeholder")

def create_checkout_session(product_id: str, success_url: str, cancel_url: str) -> str:
    # If no real key is configured, return a mock success URL immediately to allow MVP testing without a Stripe account.
    if stripe.api_key == "sk_test_placeholder":
        print(f"Mocking Stripe Checkout for {product_id}")
        return success_url
        
    # Example product catalog mapping
    # In a real app this would query a DB or use Stripe Price IDs directly
    prices = {
        "puz-lion": 499,
        "puz-mona": 499,
        "puz-cow": 399,
        "puz-pug": 399
    }
    
    if product_id not in prices:
        raise HTTPException(status_code=400, detail="Invalid product ID")
        
    try:
        checkout_session = stripe.checkout.Session.create(
            line_items=[
                {
                    'price_data': {
                        'currency': 'usd',
                        'product_data': {
                            'name': f'Puzzle: {product_id}',
                        },
                        'unit_amount': prices[product_id],
                    },
                    'quantity': 1,
                },
            ],
            mode='payment',
            success_url=success_url,
            cancel_url=cancel_url,
        )
        return checkout_session.url
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
