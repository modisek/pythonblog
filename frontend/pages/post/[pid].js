import { useRouter } from 'next/router'
import useSWR from "swr"
import ReactMarkdown from 'react-markdown'
import Header from '../components/header';


const fetcher = (...args) => fetch(...args).then((res) => res.json());
 
const Post = () => {
 const router = useRouter()
  const { pid } = router.query
const { data, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/posts/${pid}    `,
        fetcher
    );

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>


    
  return (
      <>
        <Header />
      
      <h1 className="text-3xl lg:text-6xl">{data.title}</h1>
      <ReactMarkdown>{data.description}</ReactMarkdown>
      </>
  )

}

export default Post

