"use client";
import React, { useState } from "react";
import { 
  Search, 
  Download, 
  BookOpen, 
  Video, 
  Star,
  Clock
} from "lucide-react";

const ResourcesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const categories = [
    { id: 'all', name: 'All Categories', count: 45 },
    { id: 'clinical', name: 'Clinical Guidelines', count: 12 },
    { id: 'research', name: 'Research Papers', count: 8 },
    { id: 'education', name: 'Educational Materials', count: 15 },
    { id: 'surgical', name: 'Surgical Techniques', count: 6 },
    { id: 'patient', name: 'Patient Resources', count: 4 },
  ];

  const types = [
    { id: 'all', name: 'All Types', count: 45 },
    { id: 'pdf', name: 'PDF Documents', count: 20 },
    { id: 'video', name: 'Videos', count: 12 },
    { id: 'image', name: 'Images', count: 8 },
    { id: 'link', name: 'External Links', count: 5 },
  ];

  const resources = [
    {
      id: 1,
      title: "Clinical Practice Guidelines 2024",
      description: "Comprehensive clinical practice guidelines for orthopaedic surgeons covering diagnosis, treatment, and management protocols.",
      category: "clinical",
      type: "pdf",
      size: "2.4 MB",
      downloads: 1247,
      views: 3456,
      rating: 4.8,
      isBookmarked: true,
      isNew: true,
      lastUpdated: "2 days ago",
      tags: ["Guidelines", "Clinical", "2024"],
      author: "SLOA Clinical Committee",
      thumbnail: "/api/placeholder/300/200",
    },
    {
      id: 2,
      title: "Advanced Surgical Techniques Video Series",
      description: "Step-by-step video demonstrations of advanced surgical procedures with expert commentary and detailed explanations.",
      category: "surgical",
      type: "video",
      size: "156 MB",
      downloads: 892,
      views: 2156,
      rating: 4.9,
      isBookmarked: false,
      isNew: false,
      lastUpdated: "1 week ago",
      tags: ["Surgical", "Video", "Advanced"],
      author: "Dr. Samantha Perera",
      thumbnail: "/api/placeholder/300/200",
    },
    {
      id: 3,
      title: "Research Compendium: Latest Findings",
      description: "Collection of recent research papers and findings in orthopaedic medicine, including clinical trials and case studies.",
      category: "research",
      type: "pdf",
      size: "5.1 MB",
      downloads: 567,
      views: 1234,
      rating: 4.6,
      isBookmarked: true,
      isNew: false,
      lastUpdated: "2 weeks ago",
      tags: ["Research", "Papers", "Clinical Trials"],
      author: "SLOA Research Division",
      thumbnail: "/api/placeholder/300/200",
    },
    {
      id: 4,
      title: "Patient Education Materials",
      description: "Comprehensive patient education resources including brochures, fact sheets, and informational videos.",
      category: "patient",
      type: "pdf",
      size: "8.7 MB",
      downloads: 2341,
      views: 5678,
      rating: 4.7,
      isBookmarked: false,
      isNew: false,
      lastUpdated: "3 weeks ago",
      tags: ["Patient", "Education", "Brochures"],
      author: "SLOA Patient Education Team",
      thumbnail: "/api/placeholder/300/200",
    },
    {
      id: 5,
      title: "Orthopaedic Imaging Atlas",
      description: "Comprehensive collection of diagnostic images, X-rays, and MRI scans with detailed annotations and case studies.",
      category: "education",
      type: "image",
      size: "45.2 MB",
      downloads: 445,
      views: 1890,
      rating: 4.8,
      isBookmarked: true,
      isNew: false,
      lastUpdated: "1 month ago",
      tags: ["Imaging", "Diagnostic", "Atlas"],
      author: "Dr. Rajith Silva",
      thumbnail: "/api/placeholder/300/200",
    },
    {
      id: 6,
      title: "Webinar: Latest Treatment Protocols",
      description: "Recorded webinar session covering the latest treatment protocols and evidence-based approaches in orthopaedics.",
      category: "education",
      type: "video",
      size: "89.3 MB",
      downloads: 678,
      views: 2345,
      rating: 4.5,
      isBookmarked: false,
      isNew: true,
      lastUpdated: "4 days ago",
      tags: ["Webinar", "Treatment", "Protocols"],
      author: "Dr. Anil Fernando",
      thumbnail: "/api/placeholder/300/200",
    },
    {
      id: 7,
      title: "Surgical Instrument Guide",
      description: "Complete guide to orthopaedic surgical instruments including usage, maintenance, and sterilization procedures.",
      category: "surgical",
      type: "pdf",
      size: "3.2 MB",
      downloads: 789,
      views: 1678,
      rating: 4.7,
      isBookmarked: false,
      isNew: false,
      lastUpdated: "2 weeks ago",
      tags: ["Surgical", "Instruments", "Guide"],
      author: "SLOA Surgical Committee",
      thumbnail: "/api/placeholder/300/200",
    },
    {
      id: 8,
      title: "External Resource Links",
      description: "Curated collection of external resources, research databases, and professional organizations in orthopaedics.",
      category: "education",
      type: "link",
      size: "N/A",
      downloads: 1234,
      views: 3456,
      rating: 4.6,
      isBookmarked: true,
      isNew: false,
      lastUpdated: "1 week ago",
      tags: ["External", "Links", "Databases"],
      author: "SLOA Resource Team",
      thumbnail: "/api/placeholder/300/200",
    },
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const sortedResources = [...filteredResources].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      case 'popular':
        return b.downloads - a.downloads;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'bg-red-100 text-red-700';
      case 'video':
        return 'bg-blue-100 text-blue-700';
      case 'image':
        return 'bg-green-100 text-green-700';
      case 'link':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'clinical':
        return 'bg-blue-100 text-blue-700';
      case 'research':
        return 'bg-green-100 text-green-700';
      case 'education':
        return 'bg-purple-100 text-purple-700';
      case 'surgical':
        return 'bg-orange-100 text-orange-700';
      case 'patient':
        return 'bg-pink-100 text-pink-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Member Resources</h1>
          <p className="text-muted-foreground mt-1">
            Access exclusive resources, guidelines, research papers, and educational materials
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn btn-outline">
            <Download className="h-4 w-4 mr-2" />
            Download All
          </button>
          <button className="btn btn-primary">
            <BookOpen className="h-4 w-4 mr-2" />
            Request Resource
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="card-content">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex-shrink-0">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="flex-shrink-0">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {types.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name} ({type.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="flex-shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedResources.map((resource) => (
          <div key={resource.id} className="card group hover:shadow-lg transition-all duration-300">
            {/* Resource Thumbnail */}
            <div className="relative">
              <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                {resource.type === 'video' ? (
                  <Video className="h-12 w-12 text-muted-foreground" />
                ) : (
                  <BookOpen className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              
              {/* Type Badge */}
              <div className="absolute top-3 left-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                  {resource.type.toUpperCase()}
                </span>
              </div>

              {/* Category Badge */}
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(resource.category)}`}>
                  {resource.category}
                </span>
              </div>

              {/* New Badge */}
              {resource.isNew && (
                <div className="absolute top-12 left-3">
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    NEW
                  </span>
                </div>
              )}

              {/* Bookmark Button */}
              <button className="absolute top-3 right-12 p-1 bg-white/90 rounded-full hover:bg-white transition-colors">
                {/* <Bookmark className={`h-4 w-4 ${resource.isBookmarked ? 'fill-current text-primary' : 'text-muted-foreground'}`} /> */}
              </button>
            </div>

            {/* Resource Content */}
            <div className="card-content">
              <div className="space-y-3">
                <h3 className="card-title text-lg group-hover:text-primary transition-colors line-clamp-2">
                  {resource.title}
                </h3>
                
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {resource.description}
                </p>

                {/* Resource Details */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Author:</span>
                    <span className="text-foreground font-medium">{resource.author}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Size:</span>
                    <span className="text-foreground">{resource.size}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Updated:</span>
                    <span className="text-foreground">{resource.lastUpdated}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <Download className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{resource.downloads}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{resource.views}</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span className="text-foreground font-medium">{resource.rating}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {resource.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  {/* <button className="btn btn-outline btn-sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </button> */}
                  
                  {/* <button className="btn btn-primary btn-sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sortedResources.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No resources found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filters to find resources.
          </p>
          <button 
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedType('all');
            }}
            className="btn btn-outline"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ResourcesPage;

