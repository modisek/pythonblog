import Head from "next/head";
import useSWR from "swr";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import Header from "./components/header";
import { useLgnProvider } from "../context/lgnContext";
import { useRouter } from "next/router";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Home() {
  const router = useRouter();
  const [id, setID] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [posts, setPosts] = useState("");
  const [err, setError] = useState("");

  const [tkn, setTkn] = useLgnProvider();
  async function deletePost(id) {
    const response = await fetch(`http://localhost:8000/posts/${id}`, {
      method: "DELETE",
    });
    response.json();
    router.push("/admin");
  }
  const getUid = async function () {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me/`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
    });
    const json = await res.json();
    setID(json.id);
  };
  useEffect(() => {
    getUid();
  }, []);
  //TODO: get current user and get only their blog posts
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
      `${process.env.NEXT_PUBLIC_API_URL}/users/${id}/posts/`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
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
    router.push("/admin");
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
          <div className="my-2 mx-10">
            <div
              className="block p-6 rounded-lg shadow-lg  max-w-sm"
              key={item.id}
            >
              <h1 className="text-green-400 text-4xl leading-tight font-medium mb-2">
                {item.title}
              </h1>
              <p className="text-black text-xl mb-4">{item.description} </p>
              <Link
                className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
                href={`/post/${item.id}`}
              >
                read more..
              </Link>
              <button
                onClick={() => deletePost(item.id)}
                className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
              >
                delete
              </button>
            </div>
          </div>
        ))}
      <div className="mx-10">
        <h2 className="text-2xl my-2 ">Add a blogpost</h2>
        <label htmlFor="title">Title</label>
        <input
          className="block mb-2 py-2 px-3 text-sm font-medium text-gray-900 bg-gray-50 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:text-white"
          type="text"
          value={title}
          onChange={handleChange}
        ></input>

        <label htmlFor="description">Body</label>
        <textarea
          value={description}
          onChange={handleChange1}
          className="block   py-2 px-3 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="blog content goes here"
        ></textarea>
        <button
          onClick={handleSubmit}
          className=" my-5 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
