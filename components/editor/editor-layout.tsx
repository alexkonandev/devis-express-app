import React from "react";

interface EditorLayoutProps {
  sidebar: React.ReactNode;
  header: React.ReactNode;
  children: React.ReactNode;
}

export const EditorLayout = ({ sidebar, header, children }: EditorLayoutProps) => {
  return (
    <div className="flex h-full w-full bg-neutral-50 overflow-hidden">
      {/* Main Content Area */}

      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.4]"
        style={{
          backgroundImage: "radial-gradient(#94a3b8 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Editor Toolbar (Secondary Header) */}
        {header}

        {/* Scrollable Canvas */}
        <div className="flex-1 overflow-y-auto scroll-smooth bg-neutral-100/30 relative">
          <div className="min-h-full w-full flex flex-col items-center py-12 px-8">
            {children}
          </div>
        </div>
      </div>

      
    </div>
  );
};