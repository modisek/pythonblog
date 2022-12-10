import { useRouter } from 'next/router'
import useSWR from "swr"

const fetcher = (...args) => fetch(...args).then((res) => res.json());
const Post = () => {
 const router = useRouter()
  const { pid } = router.query
const { data, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/posts/${pid}    `,
        fetcher
    );

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>
        {console.log(data.title)}
  return (
      <>
      
        <h1>{data.title}</h1>
      <p>{data.description}</p>
      </>
  )

}

export default Post

