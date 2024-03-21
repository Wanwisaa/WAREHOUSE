import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request,{ params }) {
  try {
    const productId = parseInt(params.slug); // Parse the ID to integer
    if (isNaN(productId)) {
      return Response.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const product = await prisma.products.findUnique({
      where: {
        id: productId 
      }
    });
    if (!product) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }
    return Response.json(product);
  } catch (error) {
    console.error('Error retrieving product:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
