import { PrismaClient } from '@prisma/client';
import { sign } from 'jsonwebtoken';
import { cookies } from 'next/headers'


const prisma = new PrismaClient();

export async function GET() {
    try {
        const users = await prisma.users.findMany();
        return Response.json(users);
    } catch (error) {
        console.error('Error retrieving users:', error);
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function POST(request) {
    try {
        const { email, password } = await request.json();
        if (!email || !password) {
            return new Response(JSON.stringify({ error: 'Email and password are required' }), { status: 400 });
        }
        
        const existingUser = await prisma.users.findFirst({
            where: {
                email: email,
            },
        });

        let role = "user"
        if(existingUser.email == 'test@gmail.com'){
            role = "admin"
        }

        if (!existingUser || existingUser.password !== password) {
            return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401 });
        }

        const token = sign({ userId: existingUser.id, firstName: existingUser.firstName, role: role }, process.env.SECRET_KEY, {
            expiresIn: '1h', // You can customize the expiration time
        });
        
        const response = new Response(JSON.stringify({ success: true, token, message: 'Authentication successful' }));
        
        cookies().set('token', token)
        
        
        return response;
        
    } catch (error) {
        console.error('Error processing authentication request:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}