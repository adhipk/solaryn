interface KnowledgePanelFactProps {
  name: string;
  value: string;
}

export default function KnowledgePanelFact({ name, value }: KnowledgePanelFactProps) {
  // Function to process text and convert links
  const processText = (text: string) => {
    // Handle HTML anchor tags
    const htmlLinkRegex = /<a href="([^"]+)">([^<]+)<\/a>/g;
    let processedText = text.replace(htmlLinkRegex, (_: string, url: string, text: string) => {
      return `<a href="${url}" class="text-blue-600 hover:text-blue-800" target="_blank" rel="noreferrer">${text}</a>`;
    });

    // Handle wiki-style links [[Link text]]
    const wikiLinkRegex = /\[\[([^\]]+)\]\]/g;
    processedText = processedText.replace(wikiLinkRegex, (_: string, text: string) => {
      const url = `https://en.wikipedia.org/wiki/${encodeURIComponent(text)}`;
      return `<a href="${url}" class="text-blue-600 hover:text-blue-800" target="_blank" rel="noreferrer">${text}</a>`;
    });

    return processedText;
  };

  return (
    <div className="py-2 border-t border-gray-200">
      <div className="text-sm text-gray-500">{name}</div>
      <div 
        className="text-base text-gray-800"
        dangerouslySetInnerHTML={{ __html: processText(value) }}
      />
    </div>
  );
} 