// Define constants for part types
export const PartTypeSection = 'section';
export const PartTypeParagraph = 'paragraph';
export const PartTypeField = 'field';

export interface Image {
  content_url: string;
}

export interface InfoBoxes {
  name: string;
  type: string;
  has_parts?: Part[]; // An InfoBox can have nested parts
}

export interface Part {
  type: string;
  name?: string;
  value?: string;
  has_parts?: Part[]; // A Part can have nested parts
}

export interface StructuredContent {
  name?: string;
  url?: string;
  image?: Image;
  infoboxes?: InfoBoxes[];
  sections?: Part[]; // An article can have multiple sections, each with its own parts
  abstract?: string;
  description?: string;
}

export interface IWME {
  accessToken: string;
  getStructuredContents(name: string): Promise<StructuredContent[]>;
}

export class WME implements IWME {
  private _accessToken = '';
  private _url = 'https://api.enterprise.wikimedia.com/v2';

  get accessToken(): string {
    return this._accessToken;
  }

  set accessToken(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getStructuredContents(name: string): Promise<StructuredContent[]> {
    const res = await fetch(`${this._url}/structured-contents/${name}`, {
      method: 'POST',
      body: JSON.stringify({
        limit: 1,
        fields: ['name', 'url', 'image', 'infoboxes', 'description', 'abstract', 'sections'],
        filters: [
          {
            field: 'in_language.identifier',
            value: 'en'
          }
        ]
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this._accessToken}`
      }
    });

    return res.json() as Promise<StructuredContent[]>;
  }
} 