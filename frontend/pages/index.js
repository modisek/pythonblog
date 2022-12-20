import Head from "next/head";
import useSWR from "swr";
import { useState } from "react";
import Link from "next/link";
import Header from "./components/header";

const fetcher = (...args) => fetch(...args).then((res) => res.json());
export default function Home() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [posts, setPosts] = useState("");
  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/posts`,
    fetcher
  );

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  function handleChange(e) {
    setTitle(e.target.value);
  }

  function handleChange1(e) {
    setDescription(e.target.value);
  }

  async function handleSubmit() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/1/posts/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          description: description,
        }),
      }
    );
    const json = await res.json();
    setPosts([...posts, json]);
  }
  return (
    <div className="container ">
      <Head>
        <title>Blog</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="flex flex-col justify-center ">
        <div className="mx-5 my-10">
          {data &&
            data.map((item) => (
              <div
                className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700"
                key={item.id}
              >
                <h1 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {item.title}
                </h1>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  {item.description}{" "}
                </p>
                <Link
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  href={`/post/${item.id}`}
                >
                  read more
                  <svg
                    aria-hidden="true"
                    className="w-4 h-4 ml-2 -mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </Link>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
}
