import { NextResponse } from "next/server"

interface AuthResponse {
  id_token: string
  access_token: string
  refresh_token: string
  expires_in: number
}

interface WikipediaImage {
  content_url: string
  width: number
  height: number
  alternative_text?: string
}

interface WikipediaLink {
  url: string
  text: string
  images?: WikipediaImage[]
}

interface WikipediaField {
  type: "field" | "infobox"
  name?: string
  value: string
  links?: WikipediaLink[]
}

interface WikipediaSection {
  type: "section"
  name: string
  has_parts: (WikipediaField | WikipediaSection | WikipediaImage)[]
}

interface WikipediaInfobox {
  name: string
  type: "infobox"
  has_parts: (WikipediaField | WikipediaSection)[]
}

interface WikipediaVersion {
  identifier: number
  comment: string
  tags: string[]
  scores: Record<string, unknown>
  editor: {
    identifier: number
    name: string
    edit_count: number
    groups: string[]
    date_started: string
  }
  number_of_characters: number
  size: {
    value: number
    unit_text: string
  }
  maintenance_tags: Record<string, unknown>
}

interface WikipediaArticle {
  name: string
  identifier: number
  abstract: string
  date_created: string
  date_modified: string
  date_previously_modified: string
  version: WikipediaVersion
  previous_version: {
    identifier: number
    number_of_characters: number
  }
  url: string
  namespace: {
    identifier: number
  }
  in_language: {
    identifier: string
  }
  main_entity: {
    identifier: string
    url: string
  }
  additional_entities: Array<{
    identifier: string
    url: string
    aspects?: string[]
  }>
  categories: unknown[]
  templates: unknown[]
  is_part_of: {
    identifier: string
    url: string
  }
  article_body: {
    html: string
    wikitext: string
  }
  license: Array<{
    name: string
    identifier: string
    url: string
  }>
  event: {
    identifier: string
    type: string
    date_created: string
    date_published: string
  }
  image: WikipediaImage
  infoboxes: WikipediaInfobox[]
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

async function fetchWikipediaArticle(name: string, token: string): Promise<WikipediaArticle[]> {
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

  return response.json() as Promise<WikipediaArticle[]>
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
    console.log('token',token);
    let data: WikipediaArticle[]

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
    console.log('article',data)
    const article = data[0]
    
    if (!article) {
      return NextResponse.json(
        { error: 'No Wikipedia article found' },
        { status: 404 }
      )
    }
    console.log('article infoboxes',article.infoboxes);
    // Transform the data to match our ProfileLayout structure
    const profileData = {
      profileImage: article.image?.content_url ?? "/placeholder.svg?height=400&width=300",
      name: article.name,
      socialStats: {
        twitter: 0,
        instagram: 0,
        facebook: 0,
        youtube: 0,
      },
      details: [
        { key: "Full Name", value: article.name },
        { key: "Description", value: article.abstract.split(".")[0] },
        { key: "Last Updated", value: new Date(article.date_modified).toLocaleDateString() }
      ],
      additionalInfo: article.infoboxes?.[0]?.has_parts
        .map(field => ({
          key: field.name ?? field.value.split(" ")[0],
          value: field.has_parts.map(part => part.value).join(" ")
          
        })) ?? []
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