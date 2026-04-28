import { upsertUser } from './db.js'
import { readJson, writeJson } from './storage.js'

const SEEDED_KEY = 'fsad.seeded.v4'

export function seedIfNeeded() {
  const already = readJson(SEEDED_KEY, false)
  if (already) return

  const adminId = 'u_admin'
  const farmerId = 'u_farmer'
  const buyerId = 'u_buyer'

  upsertUser({
    id: adminId,
    role: 'admin',
    name: 'Platform Admin',
    email: 'admin@fsad.local',
    password: 'admin123',
    createdAt: new Date().toISOString(),
  })
  upsertUser({
    id: farmerId,
    role: 'farmer',
    name: 'Asha Farm Co-op',
    email: 'farmer@fsad.local',
    password: 'farmer123',
    createdAt: new Date().toISOString(),
  })
  upsertUser({
    id: buyerId,
    role: 'buyer',
    name: 'Global Buyer',
    email: 'buyer@fsad.local',
    password: 'buyer123',
    createdAt: new Date().toISOString(),
  })

  const productsKey = 'fsad.products'
  const existingProducts = readJson(productsKey, [])
  if (!Array.isArray(existingProducts) || existingProducts.length === 0) {
    const now = new Date().toISOString()
    writeJson(productsKey, [
      {
        id: 'p_spiced_mango_pickle',
        farmerId,
        title: 'Spiced Mango Pickle (Small-batch)',
        category: 'Processed Foods',
        origin: 'Andhra Pradesh, India',
        price: 7.5,
        currency: 'USD',
        unit: 'jar',
        stock: 120,
        status: 'approved',
        short:
          'Tangy, spicy mango pickle made with traditional cold-pressed oils and sun-cured mangoes.',
        description:
          'A bold, authentic mango pickle crafted in small batches. Great with rice, bread, and snacks. Vacuum-sealed for freshness.',
        certifications: ['Home-made', 'Preservative-free'],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'p_banana_chips',
        farmerId,
        title: 'Kerala Banana Chips (Coconut Oil)',
        category: 'Processed Foods',
        origin: 'Kerala, India',
        price: 4.2,
        currency: 'USD',
        unit: 'pack',
        stock: 240,
        status: 'approved',
        short: 'Crispy banana chips fried in coconut oil, lightly salted.',
        description:
          'Thin-sliced banana chips made from local varieties. Packed fresh for crunch and aroma.',
        certifications: ['Small-batch'],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'p_handwoven_jute_bag',
        farmerId,
        title: 'Handmade Jute Produce Bag',
        category: 'Handmade Goods',
        origin: 'West Bengal, India',
        price: 9.9,
        currency: 'USD',
        unit: 'bag',
        stock: 80,
        status: 'pending',
        short: 'Reusable jute bag for produce and groceries.',
        description:
          'Eco-friendly jute bag designed for carrying farm produce. Durable stitching and simple design.',
        certifications: ['Handmade'],
        createdAt: now,
        updatedAt: now,
      },
    ])
  }

  writeJson(SEEDED_KEY, true)
}



