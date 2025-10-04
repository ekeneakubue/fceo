"use client";
import { useEffect, useState } from "react";
import Sidebar from "../../../components/dashboard/Sidebar";
import Topbar from "../../../components/dashboard/Topbar";

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

export default function GalleryAdminPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

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

  const persist = (next: GalleryItem[]) => setItems(next);

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

  const handleImageSelection = (files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    setSelectedImages(fileArray);
    
    // Create previews
    const previews: string[] = [];
    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        previews.push(reader.result as string);
        if (previews.length === fileArray.length) {
          setImagePreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedImages.length === 0) return;

    setLoading(true);
    try {
      // Convert files to base64
      const imagePromises = selectedImages.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

      const imageDataUrls = await Promise.all(imagePromises);

      // Create gallery items for each image
      const galleryItems = imageDataUrls.map((imageDataUrl) => ({
        title,
        date,
        imageDataUrl,
      }));

      // Upload all images
      const uploadPromises = galleryItems.map((item) =>
        fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        }).then((r) => r.json())
      );

      const createdItems = await Promise.all(uploadPromises);
      const next = [...items, ...createdItems];
      persist(next);
      setShowAdd(false);
      setTitle("");
      setDate("");
      setSelectedImages([]);
      setImagePreviews([]);
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[256px_1fr]">
      <Sidebar />
      <main className="px-0">
        <Topbar />
        <div className="px-6 py-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">Gallery</h1>
              <p className="text-black/80 dark:text-white/80 mt-2">Upload and organize media.</p>
            </div>
            <button
              className="h-10 px-4 rounded bg-[rgb(3,158,29)] text-white text-sm font-medium"
              onClick={() => {
                setTitle("");
                setDate("");
                setSelectedImages([]);
                setImagePreviews([]);
                setShowAdd(true);
              }}
            >
              Add Images
            </button>
          </div>

          {showAdd && (
            <div className="fixed inset-0 bg-black/50 z-50 grid place-items-center" role="dialog" aria-modal="true">
              <form
                className="w-[95%] max-w-4xl grid gap-4 rounded-xl border border-black/[.08] dark:border-white/[.145] bg-white dark:bg-zinc-900 p-5"
                onSubmit={handleSubmit}
              >
                <div className="text-lg font-semibold">Add Multiple Images</div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-xs mb-1">Title (optional)</label>
                    <input 
                      className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black" 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter a title for this group of images"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Date (optional)</label>
                    <input 
                      type="date" 
                      className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black" 
                      value={date} 
                      onChange={(e) => setDate(e.target.value)} 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs mb-1">Select Multiple Images</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="block w-full text-sm"
                    onChange={(e) => handleImageSelection(e.target.files)}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple images</p>
                </div>
                
                {imagePreviews.length > 0 && (
                  <div>
                    <label className="block text-xs mb-2">Preview ({imagePreviews.length} images selected)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="aspect-square rounded overflow-hidden ring-1 ring-black/10">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={preview} 
                            alt={`Preview ${index + 1}`} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-end gap-2">
                  <button 
                    type="button" 
                    onClick={() => setShowAdd(false)} 
                    className="h-10 px-4 rounded border border-black/20 text-sm"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="h-10 px-4 rounded bg-[rgb(3,158,29)] text-white text-sm font-medium"
                    disabled={loading || selectedImages.length === 0}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-3 w-3 border border-white/20 border-t-white"></div>
                        Uploading...
                      </div>
                    ) : (
                      `Upload ${selectedImages.length} Image${selectedImages.length !== 1 ? 's' : ''}`
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <div className="mt-6 flex items-center justify-center py-12">
              <div className="flex items-center gap-2 text-black/60 dark:text-white/60">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-black/20 border-t-black/60"></div>
                Loading gallery...
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-8">
              {Object.values(groupedItems).map((group, groupIdx) => (
                <div key={group.title || "untitled-" + groupIdx} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">{group.title || "Untitled"}</h2>
                      {group.date && (
                        <p className="text-sm text-black/60 dark:text-white/60">{group.date}</p>
                      )}
                    </div>
                    <button
                      className="h-8 px-3 rounded bg-red-600 text-white text-xs"
                      onClick={() => {
                        if (confirm(`Delete all images in "${group.title || "Untitled"}"?`)) {
                          const deletePromises = group.images.map((img) =>
                            fetch(`/api/gallery?id=${img.id}`, { method: "DELETE" })
                          );
                          Promise.all(deletePromises).then(() => {
                            const next = items.filter((item) => !group.images.includes(item));
                            persist(next);
                          });
                        }
                      }}
                    >
                      Delete Group
                    </button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {group.images.map((img, imgIdx) => (
                      <div key={img.id || imgIdx} className="rounded-xl overflow-hidden border border-black/[.08] dark:border-white/[.145] bg-white/70 dark:bg-white/5">
                        <div className="aspect-video bg-black/10">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img.imageDataUrl} alt={img.title || "Gallery image"} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-black/60 dark:text-white/60">#{imgIdx + 1}</span>
                            <button
                              className="h-6 px-2 rounded bg-red-600 text-white text-xs"
                              onClick={() => {
                                fetch(`/api/gallery?id=${img.id}`, { method: "DELETE" })
                                  .then(() => {
                                    const next = items.filter((item) => item.id !== img.id);
                                    persist(next);
                                  })
                                  .catch(() => {});
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {Object.keys(groupedItems).length === 0 && !loading && (
                <div className="text-center py-12">
                  <p className="text-black/60 dark:text-white/60">No images in gallery. Click "Add Images" to get started.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


