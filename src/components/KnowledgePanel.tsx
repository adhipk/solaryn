'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { WME, PartTypeField } from '../lib/wme';
import type { StructuredContent } from '../lib/wme';
import KnowledgePanelFact from './KnowledgePanelFact';

interface KnowledgePanelProps {
  name: string;
}

export default function KnowledgePanel({ name }: KnowledgePanelProps) {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<StructuredContent | null>(null);
  const wme = new WME();

  useEffect(() => {
    if (!name) return;
    
    const fetchData = async () => {
      setLoading(true);
      
      // Set the access token from local storage
      wme.accessToken = localStorage.getItem('access_token') ?? '';
      
      try {
        const structuredContents = await wme.getStructuredContents(name);
        
        if (structuredContents.length > 0 && structuredContents[0]) {
          setContent(structuredContents[0]);
        }
      } catch (err) {
        console.error(err);
      }
      
      setLoading(false);
    };
    
    void fetchData();
  }, [name]);

  const facts = content?.infoboxes?.[0]?.has_parts
    ?.map(section => section.has_parts ?? [])
    .flat()
    .filter(part => part.type === PartTypeField && part.name && part.value) ?? [];
  console.log(facts);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!content) {
    return null;
  }

  return (
    <div className="w-full max-w-xl mt-4 bg-white rounded-lg shadow-lg overflow-hidden">
      {content.image && (
        <div className="w-full h-64 relative">
          <Image
            src={content.image.content_url}
            alt={content.name ?? ""}
            layout="fill"
            objectFit="cover"
            objectPosition="center top"
          />
        </div>
      )}
      
      <div className="p-4">
        <h2 className="text-2xl font-bold text-gray-800">{content.name}</h2>
        
        {content.abstract && (
          <div className="mt-4 text-gray-700">
            <p>{content.abstract}</p>
          </div>
        )}
        
        {facts.length > 0 && (
          
          <div className="mt-4">
            {facts.map((fact, index) => (
              <KnowledgePanelFact
                key={index}
                name={fact.name ?? ""}
                value={fact.value ?? ""}
              />
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4 bg-gray-50 flex justify-end">
        <a
          href={content.url ?? "#"}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <span>View on Wikipedia</span>
          <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
          </svg>
        </a>
      </div>
    </div>
  );
} 