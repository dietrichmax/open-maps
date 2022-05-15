import prisma from "@/components/utils/prisma"
// POST /api/post
// Required fields in body: osm_id, downvotes
// Optional fields in body: upvotes
export default async function handle(req, res) {
  const { osm_id, upvotes, downvotes } = req.body
  const result = await prisma.poi_details.create({
    data: {
      osm_id: osm_id,
      upvotes: upvotes,
      downvotes: downvotes,
    },
  })
  res.json(result)
}
