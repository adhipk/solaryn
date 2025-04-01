/* eslint-disable @typescript-eslint/no-unsafe-call */
import { NextResponse } from "next/server"

interface AuthResponse {
  id_token: string
  access_token: string
  refresh_token: string
  expires_in: number
}

export interface Image {
  content_url: string
}

export interface InfoBoxes {
  name: string
  type: string
  has_parts?: Part[] // An InfoBox can have nested parts
}

export interface Part {
  type: string
  name?: string
  value?: string
  has_parts?: Part[] // A Part can have nested parts
}

export interface StructuredContent {
  name?: string
  url?: string
  image?: Image
  infoboxes?: InfoBoxes[]
  sections?: Part[] // An article can have multiple sections, each with its own parts
  abstract?: string
  description?: string
}

let accessToken: string | null = null
let tokenExpiry: number | null = null
async function getAccessToken(): Promise<string> {
  // If we have a valid token, return it
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken
  }

  // Get new token
  const response = await fetch('https://auth.enterprise.wikimedia.com/v1/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: process.env.WIKI_USERNAME?.toLowerCase(),
      password: process.env.WIKI_PASSWORD
    })
  })

  if (!response.ok) {
    throw new Error('Failed to authenticate with Wikimedia')
  }

  const data = (await response.json()) as AuthResponse
  
  // Store token and expiry (subtract 1 hour for safety margin)
  accessToken = data.access_token
  tokenExpiry = Date.now() + (data.expires_in - 3600) * 1000

  return accessToken
}

async function fetchWikipediaArticle(name: string, token: string): Promise<StructuredContent[]> {
  const response = await fetch('https://api.enterprise.wikimedia.com/v2/structured-contents/' + encodeURIComponent(name), {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      filters: [
        {
          field: "is_part_of.identifier",
          value: "enwiki"
        }
      ],
      limit: 1
    })
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch Wikipedia article: ${response.statusText}`)
  }

  return response.json() as Promise<StructuredContent[]>
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const name = searchParams.get('name')

    if (!name) {
      return NextResponse.json(
        { error: 'Name parameter is required' },
        { status: 400 }
      )
    }

    let token = await getAccessToken()

    let data: StructuredContent[]

    try {
      data = await fetchWikipediaArticle(name, token)
    } catch (error) {
      if (error instanceof Error && error.message.includes('401')) {
        // Token might be expired, clear it and try once more
        accessToken = null
        tokenExpiry = null
        token = await getAccessToken()
        data = await fetchWikipediaArticle(name, token)
      } else {
        throw error
      }
    }

    const article = data[0]
    
    if (!article) {
      return NextResponse.json(
        { error: 'No Wikipedia article found' },
        { status: 404 }
      )
    }

    // Transform the data to match our ProfileLayout structure
    const profileData = {
      profileImage: article.image?.content_url ?? "/placeholder.svg?height=400&width=300",
      name: article.name ?? "Unknown",
      socialStats: {
        twitter: 2000,
        instagram: 3000,
        facebook: 32220,
        youtube: 433330,
      },
      details: [
        { key: "Full Name", value: article.name ?? "Unknown" },
        { key: "Description", value: article.abstract?.split(".")[0] ?? "No description available" },
        { key: "Last Updated", value: new Date().toLocaleDateString() }
      ],
      additionalInfo: article.infoboxes ?? []
    }

    return NextResponse.json(profileData)
  } catch (error) {
    console.error('Error fetching Wikipedia data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Wikipedia data' },
      { status: 500 }
    )
  }
} 