import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-white absolute top-0 left-0 w-full z-10  px-4 md:px-16">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <Image
            src="/logo-finexus-df.png"
            alt="Finexus Logo"
            width={160}
            height={30}
            priority
          />
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="#sobre"
            className="text-black font-semibold hover:text-gray-400 transition-colors mr-4"
          >
            Sobre
          </Link>
          <Link
            href="/cadastro"
            className="bg-violet-600 text-white font-semibold py-2 px-5 rounded-md hover:bg-violet-700 transition-colors"
          >
            Cadastre-se
          </Link>
          <Link
            href="/login"
            className="text-black font-semibold hover:text-gray-400 transition-colors"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
