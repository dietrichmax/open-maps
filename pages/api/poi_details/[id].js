import prisma from "@/components/utils/prisma"

export default async function handle(req, res) {
  const osm_id = req.query.id

  if (req.method === "GET") {
    handleGET(osm_id, res)
  } else {
    throw new Error(`The HTTP ${req.method} method is not supported at this route.`)
  }
}

// GET /api/poi_details/:id
async function handleGET(osm_id, res) {
  if (!osm_id) return
  const poi_details = await prisma.poi_details.findUnique({
    where: { osm_id: parseInt(osm_id) },
    //include: { author: true },
  })
  res.json(poi_details)
}
