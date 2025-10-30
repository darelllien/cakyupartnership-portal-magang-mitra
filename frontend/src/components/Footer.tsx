export default function Footer() {
  return (
    <footer className="bg-gray-100 text-center py-4 mt-10 border-t border-gray-300">
      <p className="text-gray-600 text-sm">
        © {new Date().getFullYear()} Partnership Cakrawala. All rights reserved.
      </p>
    </footer>
  );
}
