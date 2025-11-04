"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ChevronDown,
  FileText,
  BookUser,
  Building2,
  Settings,
  Menu,
  X,
  Users,
  ShoppingCart,
  Package,
  BarChart2,
  Calendar,
  DollarSign,
  FilePlus,
  Receipt,
  CreditCard,
  Warehouse
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    href: "/dashboard",
  },
  {
    title: "Company",
    icon: <Building2 size={20} />,
    children: [
      { title: "Company Details", href: "/dashboard/company" },
      { title: "Fiscal Year", href: "/dashboard/fiscal-year" },
    ],
  },
  {
    title: "Accounts",
    icon: <BookUser size={20} />,
    children: [
      { title: "Chart of Accounts", href: "/dashboard/accounts" },
      { title: "Journal Entries", href: "/dashboard/journal-entries" },
    ],
  },
  {
    title: "Products",
    icon: <Package size={20} />,
    children: [
      { title: "Categories", href: "/dashboard/products/categories" },
      { title: "Products", href: "/dashboard/products" },
      { title: "Variants", href: "/dashboard/products/variants" },
    ],
  },
  {
    title: "Customers",
    icon: <Users size={20} />,
    href: "/dashboard/customers",
  },
  {
    title: "Sales",
    icon: <ShoppingCart size={20} />,
    href: "/dashboard/sales",
  },
  {
    title: "Purchases",
    icon: <CreditCard size={20} />,
    href: "/dashboard/purchases",
  },
  {
    title: "Inventory",
    icon: <Warehouse size={20} />,
    children: [
      { title: "Warehouses", href: "/dashboard/inventory/warehouses" },
    ],
  },
  {
    title: "Reports",
    icon: <BarChart2 size={20} />,
    children: [
      { title: "Balance Sheet", href: "/dashboard/reports/balance-sheet" },
      { title: "Trial Balance", href: "/dashboard/reports/trial-balance" },
    ],
  },
  {
    title: "Settings",
    icon: <Settings size={20} />,
    children: [
      { title: "Preferences", href: "/dashboard/settings/preferences" },
      { title: "Backup & Restore", href: "/dashboard/settings/backup" },
    ],
  },
];

const NavItem = ({ item, isCollapsed, pathname, openSections, toggleSection }) => {
  const isActive = (item.href && pathname === item.href) || (item.children && item.children.some(child => pathname.startsWith(child.href)));
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = (e) => {
    if (hasChildren) {
      e.preventDefault();
      toggleSection(item.title);
    }
  };

  return (
    <li className="mb-2">
      <Link href={item.href || "#"} onClick={handleClick} className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-700 ${
          isActive ? "bg-blue-500 text-white" : "text-gray-300"
        }`}>
        <div className="flex items-center">
            <span className="mr-4">{item.icon}</span>
            {!isCollapsed && <span className="text-white">{item.title}</span>}
        </div>
        {hasChildren && !isCollapsed && (
          <motion.div
            animate={{ rotate: openSections[item.title] ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown size={20} className="text-white" />
          </motion.div>
        )}
      </Link>
      <AnimatePresence>
        {hasChildren && openSections[item.title] && !isCollapsed && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="ml-8 mt-2"
          >
            {item.children.map((child) => (
              <li key={child.title} className="mb-2">
                <Link
                  href={child.href}
                  className={`block p-2 rounded-md ${
                    pathname === child.href
                      ? "bg-blue-500 text-white"
                      : "text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {child.title}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
};

const SidebarContent = ({ isCollapsed, pathname, openSections, toggleSection, toggleCollapse }) => (
    <nav className="flex flex-col h-full p-4">
      <div className="flex items-center justify-between mb-8">
        {!isCollapsed && (
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        )}
        <button onClick={toggleCollapse} className="text-white hidden lg:block">
          {isCollapsed ? <Menu size={24} /> : <X size={24} />}
        </button>
      </div>
      <ul className="flex-grow">
        {menuItems.map((item) => (
          <NavItem
            key={item.title}
            item={item}
            isCollapsed={isCollapsed}
            pathname={pathname}
            openSections={openSections}
            toggleSection={toggleSection}
          />
        ))}
      </ul>
    </nav>
  );

const Sidebar = () => {
  const [openSections, setOpenSections] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleSection = (title) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <div className="lg:hidden p-4">
        <button onClick={toggleMobileMenu} className="text-black">
          <Menu size={24} />
        </button>
      </div>
      <aside
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-all duration-300 ease-in-out z-50
        ${isMobileMenuOpen ? "w-64" : "w-0"}
        lg:relative 
        ${isCollapsed ? "lg:w-20" : "lg:w-64"}`}
      >
        <div className="flex items-center justify-between p-4 lg:hidden">
          <h1 className="text-2xl font-bold text-white">Menu</h1>
          <button onClick={toggleMobileMenu} className="text-white">
            <X size={24} />
          </button>
        </div>
        <SidebarContent
            isCollapsed={isCollapsed}
            pathname={pathname}
            openSections={openSections}
            toggleSection={toggleSection}
            toggleCollapse={toggleCollapse}
        />
      </aside>
    </>
  );
};

export default Sidebar;
