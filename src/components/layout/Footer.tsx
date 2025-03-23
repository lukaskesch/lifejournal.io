interface FooterProps {
  className?: string;
}

export default function Footer({ className = "" }: FooterProps) {
  return (
    <footer className={className}>
      <hr />
      <div className="flex justify-between px-4 py-2">
        <div>&copy; Life Journal {new Date().getFullYear()}</div>
        <div>
          <a href="https://kesch.dev">kesch.dev</a> production
        </div>
      </div>
    </footer>
  );
}
