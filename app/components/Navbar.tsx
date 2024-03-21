"use client";
import {
  Box,
  ChevronFirst,
  ChevronLast,
  LayoutDashboard,
  MoreVertical,
} from "lucide-react";
import { useContext, createContext, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation'



const SidebarContext = createContext({});

const Navbar = () => {
  const router = useRouter()
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);
  const [data, setData] = useState([
    {
      icon: <LayoutDashboard size={25} />,
      text: "แดชบอร์ด",
      alert: true,
      active: false,
      path: "/dashboard",
    },
    {
      icon: <Box size={25} />,
      text: "โกดังสินค้า",
      alert: false,
      active: false,
      path: "/warehouse",
    },
  ]);

  useEffect(() => {
    // Update the active property based on the current route
    setData((prevData) => {
      return prevData.map((item) => ({
        ...item,
        active: pathname === item.path,
      }));
    });
  }, [pathname]);

  const handleLogout = () => {
    Swal.fire({
      title: 'ต้องการออกจากระบบ?',
      text: 'คุณแน่ใจว่าต้องการที่จะออกจากระบบ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ใช่, ออกจากระบบ!',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        // Clear cookies
        
        Cookies.remove('token');
        
  
        // Show success message
        Swal.fire(
          'ออกจากระบบสำเร็จ!',
          '',
          'success'
        );
        router.push('/login')
      }
    });
  };

  return (
    <aside className={`h-screen ${expanded ? "w-60" : " w-18"} transition-all pt-3 pb-3`}>
      <nav className="h-full flex flex-col bg-[#ffffff] rounded-r-[20px]  ">
        {/* Top */}
        <div className="p-3 pb-2 flex justify-between items-center">
          <Link href={'/dashboard'}>
            <h1 className={` text-black ${ expanded ? "text-2xl" : "hidden"}`}>
              Inventory
              </h1>
          </Link>

          <button
            onClick={() => setExpanded((prevExpanded) => !prevExpanded)}
            className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        {/* Mid */}
        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3 py-1">
            {data.map((item, index) => (
              <Link href={item.path} key={index}>
              <li
                className={`
                  relative flex items-center py-2 my-2 
                  font-medium rounded-md cursor-pointer
                  transition-colors group
                  ${
                    item.active
                      ? " bg-[#FFF500] text-black transition-duration-100"
                      : "hover:bg-[#FFF500] text-black hover:text-black transition-duration-100"
                  }
                `}
              >
                
                  <div className="px-2">{item.icon}</div>
                  <span
                    className={`overflow-hidden transition-all ${
                      expanded ? "w-52 ml-3" : "w-0"
                    }`}
                  >
                    {expanded && <div>{item.text}</div>}
                  </span>
                
                {item.alert && (
                  <div
                    className={`absolute w-2 h-2 rounded bg-red-500  ${
                      expanded ? "right-2" : "top-2 right-2"
                    }`}
                  />
                )}

                {!expanded && (
                  <div
                    className={`
                      absolute left-full rounded-md px-2 py-1 ml-6
                      bg-indigo-100 text-indigo-800 text-sm
                      invisible opacity-20 -translate-x-3 transition-all
                      group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
                    `}
                  >
                    {item.text}
                  </div>
                )}
              </li>
              </Link>
            ))}
          </ul>
        </SidebarContext.Provider>

  


          <div className={`flex mb-4 mx-auto justify-center ${ expanded ? "w-52 " : "hidden"}`}>
         
          <button className=" bg-red-500 py-3 rounded-md w-52 text-white" onClick={handleLogout}  >
            ออกจากระบบ
          </button>

           </div>

        
      
      </nav>
    </aside>
  );
};

export default Navbar;
