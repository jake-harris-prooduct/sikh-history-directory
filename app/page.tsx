'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { getGoogleDriveImageUrl } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HistoricalFigure {
  id: number;
  englishName: string;
  punjabiName: string;
  birthYear: number;
  deathYear: number;
  oneLiner: string;
  knownFor: string;
  tags: string;
  notableAssociates: string;
  imageUrl: string;
}

export default function Home() {
  const [figures, setFigures] = useState<HistoricalFigure[]>([]);
  const [filteredFigures, setFilteredFigures] = useState<HistoricalFigure[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [expandedFigure, setExpandedFigure] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFigures();
  }, []);

  useEffect(() => {
    filterFigures();
  }, [searchTerm, selectedTag, figures]);

  const fetchFigures = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('api/figures');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setFigures(data);

      // Extract unique tags - modified to safely handle undefined/null tags
      const tags = new Set<string>();
      data.forEach((figure: HistoricalFigure) => {
        if (figure.tags && typeof figure.tags === 'string') {
          tags.add(figure.tags.trim());
        }
      });
      setAvailableTags(Array.from(tags));
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching figures:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  const filterFigures = () => {
    let filtered = [...figures];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(figure => 
        figure.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        figure.punjabiName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by tag
    if (selectedTag && selectedTag !== 'all') {
      filtered = filtered.filter(figure => 
        figure.tags && typeof figure.tags === 'string' && 
        figure.tags.trim().toLowerCase() === selectedTag.toLowerCase()
      );
    }

    // Sort by death year
    filtered.sort((a, b) => (a.deathYear || 0) - (b.deathYear || 0));

    setFilteredFigures(filtered);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-8">Sikh Historical Figures</h1>
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8">
            Sikh Historical Figures
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-md mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Sikh Historical Figures
        </h1>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name..."
              className="pl-10 w-full h-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select
            value={selectedTag}
            onValueChange={setSelectedTag}
          >
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {availableTags.map(tag => (
                <SelectItem key={tag} value={tag}>{tag}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredFigures.map((figure) => (
        <Card 
          key={figure.id}
          className="cursor-pointer transition-all duration-300 hover:shadow-xl relative bg-[#2C1810] p-1 rounded-none"
          onClick={() => setExpandedFigure(expandedFigure === figure.id ? null : figure.id)}
        >
          <div className="border-8 border-[#DAA520] bg-white">
            <CardContent className="p-4">
              <div className="relative mb-4 shadow-md" style={{ aspectRatio: '4/5' }}>
                <img
                  src={figure.imageUrl || "/api/placeholder/400/500"}
                  alt={figure.englishName}
                  className="w-full h-full object-cover rounded-sm"
                />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold">{figure.englishName}</h3>
                <h4 className="text-md text-gray-600">{figure.punjabiName}</h4>
                <p className="text-sm text-gray-500">
                  {figure.birthYear} - {figure.deathYear}
                </p>
                <p className="mt-2 text-sm text-gray-600">{figure.oneLiner}</p>
              </div>

              {expandedFigure === figure.id && (
                <div className="mt-4 space-y-2 border-t pt-4">
                  <div>
                    <h5 className="text-sm font-semibold">Known for:</h5>
                    <p className="text-sm text-gray-600">{figure.knownFor}</p>
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold">Notable Associates:</h5>
                    <p className="text-sm text-gray-600">{figure.notableAssociates}</p>
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold">Tag:</h5>
                    <span className="px-2 py-1 text-xs bg-gray-100 rounded-full text-gray-600">
                      {figure.tags}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
        
        {filteredFigures.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No historical figures found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
