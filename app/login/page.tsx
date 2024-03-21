"use client";
import Image from "next/image";
import { useState, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Swal from 'sweetalert2';

export default function Login() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL; // Change this to the actual deployed server URL
      const response = await axios.post(`${baseURL}/login/api`, credentials);
      const token = await response.data.token;
      const decoded = jwtDecode(token) as { role: string };
      const role = decoded.role;

      if (response.status >= 200 && response.status < 300 && role == "admin") {
        Swal.fire({
          icon: 'success',
          title: 'เข้าสู่ระบบสำเร็จ',
          text: 'ยินดีต้อนรับเข้าสู่ระบบ',
        });
        router.push("/dashboard");
        // localStorage.setItem('token', response.data.token);
      } else if (
        response.status >= 200 &&
        response.status < 300 &&
        role == "user"
      ) {
        Swal.fire({
          icon: 'success',
          title: 'เข้าสู่ระบบสำเร็จ',
          text: 'ยินดีต้อนรับเข้าสู่ระบบ',
        });
        router.push("/home");
      } else {
        console.error("Login failed");
        Swal.fire({
          icon: 'error',
          title: 'เข้าสู่ระบบไม่สำเร็จ',
          text: 'กรุณาตรวจสอบอีเมลหรือรหัสผ่านของคุณ',
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      Swal.fire({
        icon: 'error',
        title: 'เข้าสู่ระบบไม่สำเร็จ',
        text: 'กรุณาตรวจสอบอีเมลหรือรหัสผ่านของคุณ',
      });
    }
  };

  return (
    <div className=" grid grid-cols-2 w-full h-[100vh] gap-10 overflow-hidden p-10 bg-[#F4F4F4]">
      {/* Leftside */}
      <div className="flex flex-col gap-10">
        <div className="rounded-[20px] h-[70%] bg-[#FFF500] ">
          <div className="  flex flex-col gap-2 p-10">
            <h1 className=" text-7xl font-bold">ระบบจัดการสินค้า</h1>
            <h1 className=" text-4xl font-light">เข้าสู่ระบบ</h1>
            <h1 className=" text-4xl font-light">เพื่อจัดการ</h1>
            <h1 className=" text-4xl font-light">สินค้า</h1>
          </div>
        </div>
        <div className=" relative rounded-[20px] h-[30%] bg-[#191313]">
          <h1 className=" absolute text-5xl font-bold bottom-10 right-10 text-white">
            My warehouse
          </h1>
        </div>
      </div>
      {/* Rightside */}

      <div className="h-[100%] rounded-[20px] bg-white w-full relative">
        <form onSubmit={handleSubmit}>
          <div className="text-center">
            <h2 className="text-7xl font-extrabold  mt-20">My warehouse</h2>
          </div>
          <div className="text-center">
            <h2 className="text-4xl font-extrabold  mt-10">เข้าสู่ระบบ</h2>
          </div>
          <div className="mt-8 space-y-6 mx-auto">
            <div className="w-[60%] mx-auto relative my-12">
              <input
                type="text"
                name="email"
                id="email"
                autoComplete="email"
                required
                value={credentials.email}
                onChange={handleChange}
                className="block w-[100%] py-3 border rounded-[12px] bg-[#191313] text-white"
                placeholder="อีเมล"
              />
              <h1 className=" absolute -top-8">
                อีเมล
              </h1>
            </div>

            <div className="w-[60%] mx-auto relative my-12">
            <input
              type="password"
              name="password"
              id="password"
              autoComplete="current-password"
              required
              value={credentials.password}
              onChange={handleChange}
              className="block w-[100%]  py-3 border rounded-[12px] bg-[#191313] text-white"
              placeholder="รหัสผ่าน"
            />
            <h1 className=" absolute -top-8">
                รหัสผ่าน
              </h1>
            </div>
            
            <button
              type="submit"
              className="block w-[60%] py-5 border rounded-[12px] bg-[#FFF500] mx-auto text-2xl"
            >
              เข้าสู่ระบบ
            </button>
          </div>
        </form>

        <div className="flex  h-[30%] w-[92%] absolute mx-auto bottom-10 left-0 right-0">
          <Image
            src="/loginpage/boxlogin.png"
            fill
            alt="Picture of the author"
            loading="lazy"
          ></Image>
        </div>
      </div>
    </div>
  );
}
