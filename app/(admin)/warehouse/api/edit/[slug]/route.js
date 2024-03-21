import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request, { params }) {
  
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const id = parseInt(params.slug);

    // Check if id is a valid positive integer
    if (isNaN(id) || id <= 0) {
      return new Response(JSON.stringify({ error: 'Invalid ID format' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const { productCode, productName, description, storagePlace, quantity } = await request.json();

    // Check if required fields are present
    if (!productCode || !productName || !description || !storagePlace || !quantity) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const updatedProduct = await prisma.products.update({
      where: { id: id },
      data: {
        productCode,
        productName,
        description,
        storagePlace,
        quantity,
      },
    });

    return new Response(JSON.stringify(updatedProduct), { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  } finally {
    await prisma.$disconnect();
  }
}
