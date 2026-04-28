function toList(value) {
  if (!value) return []
  if (Array.isArray(value)) return value.filter(Boolean)
  return String(value)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export function generateProductCopy({
  title,
  category,
  origin,
  process,
  shelfLife,
  certifications,
  targetBuyer,
}) {
  const certs = toList(certifications)
  const parts = [
    category ? `${category}` : null,
    origin ? `from ${origin}` : null,
    process ? `crafted using ${process}` : null,
  ].filter(Boolean)

  const short = parts.length
    ? `${title} — ${parts.join(', ')}.`
    : `${title} — small-batch, farm-to-market quality.`

  const bullets = [
    origin ? `Origin: ${origin}` : null,
    process ? `Process: ${process}` : null,
    shelfLife ? `Shelf life: ${shelfLife}` : null,
    certs.length ? `Tags: ${certs.join(' • ')}` : null,
    targetBuyer ? `Ideal for: ${targetBuyer}` : null,
  ].filter(Boolean)

  const long = [
    `Bring authentic, value-added quality to your catalog with ${title}.`,
    parts.length ? `This product is ${parts.join(', ')}.` : null,
    certs.length
      ? `Quality notes: ${certs.join(', ')}.`
      : 'Quality notes: consistent batch standards and careful packaging.',
    targetBuyer
      ? `Great fit for ${targetBuyer} buyers looking for reliable supply and story-rich products.`
      : 'Great fit for buyers looking for story-rich products and reliable supply.',
    'Contact the farmer for bulk pricing, MOQ, and shipping options.',
  ]
    .filter(Boolean)
    .join(' ')

  const keywords = [
    title,
    category,
    origin,
    ...certs,
    'farm-to-market',
    'value-added',
  ].filter(Boolean)

  return { short, bullets, long, keywords }
}

