export default function Footer() {
  return (
    <footer>
      <hr />
      <div className="flex justify-between px-4 py-2">
        <div>&copy; Focus Journal {new Date().getFullYear()}</div>
        <div>
          <a href="https://kesch.dev">kesch.dev</a> production
        </div>
      </div>
    </footer>
  );
}
