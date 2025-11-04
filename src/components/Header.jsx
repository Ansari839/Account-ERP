// import React from 'react';

// const Header = () => {
//   return (
//     <header className="h-16 w-full bg-gray-700 text-white flex items-center justify-between px-4">
//       <div>
//         <h1 className="text-xl font-bold">ERP System</h1>
//       </div>
//       <div>
//         <span>User Info / Logout</span>
//       </div>
//     </header>
//   );
// };

// export default Header;


import React from 'react';
import { useCompanyInfo } from '@/hooks/useCompanyInfo';

const Header = ({ toggleSidebar }) => {
  const { company, activeFiscalYear } = useCompanyInfo();

  return (
    <header className="h-16 w-full bg-gray-700 text-white flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="text-white focus:outline-none md:hidden"
        >
          ☰
        </button>
        <div>
          <h1 className="text-lg font-bold">{company?.name || 'ERP System'}</h1>
          {activeFiscalYear && (
            <p className="text-xs text-gray-300">
              Fiscal Year: {activeFiscalYear.name}
            </p>
          )}
        </div>
      </div>
      <div>
        <span>User Info / Logout</span>
      </div>
    </header>
  );
};

export default Header;
