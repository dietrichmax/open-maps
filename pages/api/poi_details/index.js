import prisma from "@/components/utils/prisma"

export default async function handle(req, res) {
  const { osmId, upvotes, downvotes } = req.body
  const result = await prisma.poi_details
    .upsert({
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
    .catch(function (error) {
      console.log(error)
    })
  res.json(result)
}
