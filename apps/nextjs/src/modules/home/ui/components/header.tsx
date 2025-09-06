import Link from "next/link";

export const Header = () => {
  return (
    <header className="mb-8 flex w-full items-center justify-between p-4 shadow-sm">
      <h1 className="text-2xl font-bold tracking-tight">
        Bite
        <span className="pl-1 text-primary">T3</span>
      </h1>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link href="/about" className="text-gray-700 hover:text-gray-900">
              About
            </Link>
          </li>
          <li>
            <Link href="/blog" className="text-gray-700 hover:text-gray-900">
              Blog
            </Link>
          </li>
          <li>
            <Link href="/contact" className="text-gray-700 hover:text-gray-900">
              Contact
            </Link>
          </li>
          <li>
            <Link
              className="rounded-md bg-slate-500 px-4 py-2 text-white hover:bg-slate-500/80"
              href="/sign-up"
            >
              sign up
            </Link>
          </li>
          <li>
            <Link
              className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/80"
              href="/sign-in"
            >
              sign in
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};
