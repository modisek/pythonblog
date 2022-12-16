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
      {data &&
        data.map((item) => (
          <div className="">
            <div
              className="block p-6 rounded-lg shadow-lg  max-w-sm"
              key={item.id}
            >
              <h1 className="text-green-400 text-4xl leading-tight font-medium mb-2">
                {item.title}
              </h1>
              <p className="text-gray-50 text-xl mb-4">{item.description} </p>
              <Link
                className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
                href={`/post/${item.id}`}
              >
                read more..
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
}
