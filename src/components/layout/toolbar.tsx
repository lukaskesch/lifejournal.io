export default function Toolbar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row justify-between items-center p-4 content-end bg-primary-foreground rounded-md w-full">
      {children}
    </div>
  );
}
