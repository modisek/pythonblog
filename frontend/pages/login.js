import { useState } from "react";
import { useRouter } from "next/router";
import Header from "./components/header";
import { useLgnProvider } from "../context/lgnContext";
import Error from "./components/error";
import Footer from "./components/footer";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [item, setItem] = useLgnProvider();
  const router = useRouter();

  function handleUsernameChange(e) {
    setUsername(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: username,
        password: password,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.detail);
    } else {
      const loggedin = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      setItem(data.access_token);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("logIn", loggedin);
      router.push("admin");
    }
  }

  return (
    <>
      <div className=" container min-h-full flex  sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Header />
          <main className="flex justify-center">
            <div>
              <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                  Sign in to your account
                </h2>
              </div>
              <form
                className="mt-8 space-y-6"
                action="#"
                method="POST"
                onSubmit={handleSubmit}
              >
                <input type="hidden" name="remember" defaultValue="true" />
                <div className="rounded-md shadow-sm -space-y-px">
                  <div>
                    <label htmlFor="username" className="sr-only">
                      Username
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                      placeholder="Username"
                      value={username}
                      onChange={handleUsernameChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="sr-only">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                      placeholder="Password"
                      value={password}
                      onChange={handlePasswordChange}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-medium text-green-600 hover:text-green-500"
                    >
                      Forgot your password?
                    </a>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3"></span>
                    Sign in
                  </button>
                </div>
                {error ? <Error text={`Error: ${error}`} /> : ""}
              </form>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
