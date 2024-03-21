import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
      const products = await prisma.products.findMany();
      return Response.json(products);
  } catch (error) {
      console.error('Error retrieving users:', error);
      return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
      await prisma.$disconnect();
  }
}

export async function POST(request) {
     try {
      const { productCode, productName, description, storagePlace, quantity } = await request.json();
      // Check if required fields are present
      if (!productCode || !productName || !description || !storagePlace || !quantity) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }
  
      const newProduct = await prisma.products.create({
        data: {
          productCode,
          productName,
          description,
          storagePlace,
          quantity,
        },
      });
  
      return new Response(JSON.stringify(newProduct), { headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    } finally {
      await prisma.$disconnect();
    }
  }
  