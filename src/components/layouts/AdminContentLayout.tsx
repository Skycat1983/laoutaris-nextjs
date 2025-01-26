interface AdminContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function AdminContentLayout({
  title,
  children,
}: AdminContentLayoutProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 bg-orange-100">
      <div className="col-span-2 bg-greyish/10 hover:bg-whitish flex flex-col">
        <div className="flex flex-col p-4">
          <div className="flex flex-row">
            <h1 className="text-4xl font-archivo p-8 mt-8">{title}</h1>
          </div>
          {children}
        </div>
      </div>
      <div className="hidden lg:block">
        <div className="w-full h-full bg-blue-100 hover:bg-whitish">
          <h1 className="text-4xl font-archivo p-8 mt-8">Feed</h1>
        </div>
      </div>
    </div>
  );
}
