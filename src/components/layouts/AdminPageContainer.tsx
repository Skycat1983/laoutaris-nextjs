interface AdminPageContainerProps {
  children: React.ReactNode;
}

export function AdminPageContainer({ children }: AdminPageContainerProps) {
  return (
    <div className="col-span-4 pl-2 bg-red-100 flex flex-col">{children}</div>
  );
}
