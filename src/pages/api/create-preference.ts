import type { APIRoute } from 'astro';
import { MercadoPagoConfig, Preference } from 'mercadopago';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { userId, title, quantity, currency_id, unit_price } = body;

    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), { status: 400 });
    }

    // Initialize MercadoPago Client with the Access Token from .env
    // Astro exposes them through import.meta.env
    const client = new MercadoPagoConfig({ 
        accessToken: import.meta.env.MP_ACCESS_TOKEN 
    });
    
    // Create the preference
    const preference = new Preference(client);

    const preferenceData = await preference.create({
      body: {
        items: [
          {
            id: 'PRO_SUBSCRIPTION',
            title: title || 'Manejate PRO - Suscripción Mensual',
            quantity: quantity || 1,
            currency_id: currency_id || 'ARS',
            unit_price: unit_price || 3500,
          },
        ],
        external_reference: userId, // VITAL for the Webhook to identify the user
        back_urls: {
          success: new URL('?payment=success', request.url).origin + '?payment=success',
          pending: new URL('?payment=pending', request.url).origin + '?payment=pending',
          failure: new URL('?payment=failure', request.url).origin + '?payment=failure',
        },
        auto_return: 'approved',
      },
    });

    return new Response(JSON.stringify({ id: preferenceData.id }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error: any) {
    console.error('Error creating preference:', error);
    return new Response(JSON.stringify({ error: error.message || 'Server error occurred' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
