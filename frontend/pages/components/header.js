import Link from "next/link";

export default function Header(){
    return (
        <div className="flex h-20 bg-white text-black container px-4 mx-auto md:flex md:items-center">
              <nav className="py-2 md:py-4">
        <div className="flex justify-around items-center">
        <div className="font-bold text-xl text-green-400" ><Link href="/">Blog</Link></div>
        <div>
        <Link className="p-2 lg:px-4 md:mx-2 text-white rounded bg-green-400" href="/">home</Link>
        <Link className="p-2 lg:px-4 md:mx-2 text-gray-600 rounded hover:bg-gray-200 hover:text-gray-700 transition-colors duration-300" href="/login">login</Link>
        <Link className="p-2 lg:px-4 md:mx-2 text-gray-600 rounded hover:bg-gray-200 hover:text-gray-700 transition-colors duration-300" href="/register">sign up</Link>
        </div>
</div>
        </nav>
        </div>
      
    )
}
