export interface SocialStats {
  twitter?: number
  instagram?: number
  facebook?: number
  youtube?: number
}

export interface DetailItem {
  key: string
  value: string | string[]
}

export interface CareerInfo {
  years: number
  leagueLogo: string
  teamLogo: string
}

export interface BusinessInfo {
  founder: {
    logo: string
  }
  coFounder?: {
    logo: string
  }
}

export interface FeaturedPerson {
  image: string
  name: string
  relation: string
}

export interface EntourageInfo {
  nfl: number
  staff: number
  familyAndFriends: number
  featuredPerson: FeaturedPerson
}

export interface ProfileData {
  profileImage: string
  name: string
  socialStats: SocialStats
  details: DetailItem[]
  additionalInfo: DetailItem[]
}

// On-demand API types
export interface WikipediaImage {
  content_url: string
  width: string
  height: string
  caption: string
  alternative_text: string
}

export type WikipediaInfobox = Record<string, string | string[]>

export interface WikipediaSection {
  title: string
  level: number
  content: string
  sections?: WikipediaSection[]
}

export interface WikipediaArticle {
  name: string
  identifier: number
  abstract: string
  description: string
  url: string
  date_created: string
  date_modified: string
  infoboxes: WikipediaInfobox[]
  sections: WikipediaSection[]
  image?: WikipediaImage
  is_part_of: {
    identifier: string
    code: string
    name: string
    url: string
    in_language: {
      identifier: string
      name: string
      alternate_name: string
      direction: string
    }
  }
  in_language: {
    identifier: string
    name: string
    alternate_name: string
    direction: string
  }
}

export interface WikipediaResponse {
  fields: string
  filters: string
  limit: number
  data: WikipediaArticle[]
}

export interface SearchResponse {
  query: {
    search: Array<{
      pageid: number
    }>
  }
} 