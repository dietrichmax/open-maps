import prisma from "@/components/utils/prisma"
// POST /api/post
// Required fields in body: osm_id, downvotes
// Optional fields in body: upvotes
export default async function handle(req, res) {
  const { osmId, upvotes, downvotes } = req.body
  const result = await prisma.poi_details.upsert({
    where: {
      osm_id: osmId,
    },
    update: {
      upvotes: upvotes,
      downvotes: downvotes,
    },
    create: {
      osm_id: osmId,
      upvotes: upvotes,
      downvotes: downvotes,
    },
  })
  res.json(result)
}
