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

      {/* Right Sidebar - Fixed width */}
      <aside className="w-80 shrink-0 bg-white border-l border-neutral-200 flex flex-col z-20 shadow-xl h-full overflow-y-auto">
        {sidebar}
      </aside>
    </div>
  );
};
