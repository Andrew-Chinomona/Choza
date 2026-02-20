export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode,
}) {


    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
      {/* HEADER 
        Using a custom red hex color based on mockup. 
        Adjust the hex code based on hotel brand
      */}
      <header className="flex h-20 items-center justify-between bg-[#cf5c5c] px-4 shadow-md">
        
        {/* Left Side: Avatar/Logo & Title */}
        <div className="flex items-center gap-4">
          {/* Circular Avatar Placeholder */}
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white border-2 border-[#cf5c5c] shadow-sm">
            {/* You can drop an image tag or user initials here later */}
          </div>
          
          {/* Hotel Name */}
          <h1 className="text-lg font-serif uppercase tracking-widest text-white">
            Fairfield Hotel
          </h1>
        </div>

        {/* hamburger */}
        <button 
          aria-label="Open menu" 
          className="rounded p-2 text-white hover:bg-white/20 focus:outline-none"
        >
          <svg 
            className="h-8 w-8" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 6h16M4 12h16M4 18h16" 
            />
          </svg>
        </button>
      </header>

      <main className="flex-1 p-4">
        {children}
      </main>
    </div>
  );
}