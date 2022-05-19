import useSWR from 'swr';
import { fetchGET } from '@/components/utils/fetcher';


//const { data } = useSWR('/api/unsplash', fetchGET);

export default function handler(req, res) {
  const body = req.body
  console.log(req.body)
  res.status(200).json({body})
}