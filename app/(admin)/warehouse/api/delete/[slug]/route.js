import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(request, { params }) {

  if (request.method !== 'DELETE') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const id = parseInt(params.slug);

    // Check if id is a valid positive integer
    if (isNaN(id) || id <= 0) {
      return new Response(JSON.stringify({ error: 'Invalid ID format' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Use the delete method to remove the row with the specified ID
    const deletedProduct = await prisma.products.delete({
      where: { id: id },
    });

    return new Response(JSON.stringify(deletedProduct), { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  } finally {
    await prisma.$disconnect();
  }
}
