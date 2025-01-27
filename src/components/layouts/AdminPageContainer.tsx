interface AdminPageContainerProps {
  children: React.ReactNode;
}

export function AdminPageContainer({ children }: AdminPageContainerProps) {
  return <div className="col-span-4 pl-2 flex flex-col">{children}</div>;
}
