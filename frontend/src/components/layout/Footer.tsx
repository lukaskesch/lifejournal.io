export default function Footer() {
  return (
    <footer>
      <hr />
      <div className="flex justify-between px-4 py-2">
        <div>&copy; My Focus Journal {new Date().getFullYear()}</div>
      </div>
    </footer>
  );
}
