// import React from 'react';
// import Link from 'next/link';

// const Sidebar = () => {
//   return (
//     <div className="w-64 bg-gray-800 text-white min-h-screen p-4">
//       <ul>
//         <li className="mb-4">
//           <Link href="/" className="hover:text-gray-300">Dashboard</Link>
//         </li>
//         <li className="mb-4">
//           <Link href="/products" className="hover:text-gray-300">Products</Link>
//         </li>
//         <li className="mb-4">
//           <Link href="/sales" className="hover:text-gray-300">Sales</Link>
//         </li>
//         <li className="mb-4">
//           <Link href="/customers" className="hover:text-gray-300">Customers</Link>
//         </li>
//         <li className="mb-4">
//           <Link href="/purchases" className="hover:text-gray-300">Purchases</Link>
//         </li>
//         <li>
//           <Link href="/reports" className="hover:text-gray-300">Reports</Link>
//         </li>
//       </ul>
//     </div>
//   );
// };

// export default Sidebar;

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Sales", href: "/sales" },
    { name: "Customers", href: "/customers" },
    { name: "Purchases", href: "/purchases" },
    { name: "Reports", href: "/reports" },
    { name: "Accounts", href: "/accounts" },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <ul>
        {links.map(link => (
          <li key={link.href} className="mb-4">
            <Link
              href={link.href}
              className={`px-2 py-1 block rounded hover:bg-gray-700 ${
                pathname === link.href ? "bg-gray-700 font-bold" : ""
              }`}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
