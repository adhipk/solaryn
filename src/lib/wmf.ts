export interface SuggestionResponse {
  query: string;
  suggestions: string[];
  descriptions: string[];
  urls: string[];
}

export interface IWMF {
  getSuggestions(query: string): Promise<SuggestionResponse>;
}

export class WMF implements IWMF {
  private _url = 'https://en.wikipedia.org/w/api.php';

  async getSuggestions(query: string): Promise<SuggestionResponse> {
    const params = new URLSearchParams({
      action: 'opensearch',
      search: query,
      namespace: '0',
      limit: '10',
      format: 'json',
      formatversion: '2',
      origin: '*'
    });
    
    const res = await fetch(`${this._url}?${params.toString()}`, {
      method: 'GET',
      redirect: 'follow'
    });

    const data = await res.json() as [string, string[], string[], string[]];
    return {
      query: data[0],
      suggestions: data[1],
      descriptions: data[2],
      urls: data[3]
    };
  }
} 