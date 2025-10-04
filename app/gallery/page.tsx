"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";

type GalleryItem = {
  id?: string;
  title?: string;
  imageDataUrl: string;
  date?: string;
  createdAt?: string;
  updatedAt?: string;
};

type GalleryGroup = {
  id?: string;
  title?: string;
  date?: string;
  images: GalleryItem[];
  createdAt?: string;
  updatedAt?: string;
};

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/gallery")
      .then(async (r) => {
        const data = await r.json();
        setItems(data);
      })
      .catch((error) => {
        console.error("Error fetching gallery:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Group images by title
  const groupedItems = items.reduce((groups: { [key: string]: GalleryGroup }, item) => {
    const key = item.title || "Untitled";
    if (!groups[key]) {
      groups[key] = {
        title: item.title,
        date: item.date,
        images: [],
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    }
    groups[key].images.push(item);
    return groups;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Gallery</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our collection of images showcasing campus life, events, and memorable moments at FCE Ofeme Ohuhu.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2 text-gray-600">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-200 border-t-gray-600"></div>
                Loading gallery...
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.values(groupedItems).map((group, groupIdx) => (
                <div key={group.title || "untitled-" + groupIdx} className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">{group.title || "Untitled"}</h2>
                    {group.date && (
                      <p className="text-sm text-gray-500">{group.date}</p>
                    )}
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {group.images.map((img, imgIdx) => (
                      <div 
                        key={img.id || imgIdx} 
                        className="group relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white"
                      >
                        <div className="aspect-video bg-gray-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={img.imageDataUrl} 
                            alt={img.title || `Gallery image ${imgIdx + 1}`} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                          />
                        </div>
                        <div className="p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">#{imgIdx + 1}</span>
                            <span className="text-xs text-gray-400">
                              {img.createdAt && new Date(img.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {Object.keys(groupedItems).length === 0 && !loading && (
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No images yet</h3>
                    <p className="text-gray-500">Check back later for gallery updates.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
