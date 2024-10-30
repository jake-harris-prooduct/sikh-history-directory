import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { 
  Card,
  CardContent
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Directory = () => {
  const [figures, setFigures] = useState([]);
  const [filteredFigures, setFilteredFigures] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [availableTags, setAvailableTags] = useState([]);
  const [expandedFigure, setExpandedFigure] = useState(null);

  useEffect(() => {
    fetchFigures();
  }, []);

  useEffect(() => {
    filterFigures();
  }, [searchTerm, selectedTag, figures]);

  const fetchFigures = async () => {
    try {
      const response = await fetch('/api/figures');
      const data = await response.json();
      setFigures(data);
      
      // Extract unique tags
      const tags = new Set();
      data.forEach(figure => {
        figure.tags.split(',').forEach(tag => tags.add(tag.trim()));
      });
      setAvailableTags(Array.from(tags));
    } catch (error) {
      console.error('Error fetching figures:', error);
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
        figure.tags.toLowerCase().includes(selectedTag.toLowerCase())
      );
    }

    // Sort by death year
    filtered.sort((a, b) => a.deathYear - b.deathYear);

    setFilteredFigures(filtered);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name..."
            className="pl-10 w-full h-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={selectedTag}
          onValueChange={setSelectedTag}
        >
          <SelectTrigger className="w-48">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredFigures.map((figure) => (
          <Card 
            key={figure.id}
            className="cursor-pointer transition-all duration-300"
            onClick={() => setExpandedFigure(expandedFigure === figure.id ? null : figure.id)}
          >
            <CardContent className="p-4">
              <div className="aspect-square relative mb-4">
                <img
                  src={figure.imageUrl || "/api/placeholder/400/400"}
                  alt={figure.englishName}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <h3 className="text-lg font-semibold">{figure.englishName}</h3>
              <h4 className="text-md">{figure.punjabiName}</h4>
              <p className="text-sm text-gray-600">
                {figure.birthYear} - {figure.deathYear}
              </p>
              
              {/* Hover content */}
              <p className="mt-2 text-sm">{figure.oneLiner}</p>
              
              {/* Expanded content */}
              {expandedFigure === figure.id && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm"><strong>Known for:</strong> {figure.knownFor}</p>
                  <p className="text-sm"><strong>Notable Associates:</strong> {figure.notableAssociates}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Directory;
