"use client";

import { useState, useEffect } from "react";
import { updateMovie } from "../../services/movieService";
import { Movie, SiteInfo } from "../../types/movie";

interface EditMovieFormProps {
  movie: Movie;
  onMovieUpdated: (movie: Movie) => void;
  onCancel: () => void;
}

export default function EditMovieForm({
  movie,
  onMovieUpdated,
  onCancel,
}: EditMovieFormProps) {
  const [formData, setFormData] = useState({
    title: movie.title,
    posterPath: movie.posterPath,
    rating: movie.rating,
    year: movie.year,
    genres: movie.genres.join(", "),
    description: movie.description || "",
    director: movie.director || "",
    stars: movie.stars ? movie.stars.join(", ") : "",
    runtime: movie.runtime || "",
  });

  const [siteInfoList, setSiteInfoList] = useState<SiteInfo[]>(
    movie.siteInfo || []
  );
  const [currentSiteInfo, setCurrentSiteInfo] = useState<SiteInfo>({
    siteName: "",
    siteLink: "",
    tags: [],
  });
  const [currentTag, setCurrentTag] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSiteInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentSiteInfo({
      ...currentSiteInfo,
      [name]: value,
    });
  };

  const handleAddTag = () => {
    if (currentTag.trim() !== "") {
      setCurrentSiteInfo({
        ...currentSiteInfo,
        tags: [...currentSiteInfo.tags, currentTag.trim()],
      });
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setCurrentSiteInfo({
      ...currentSiteInfo,
      tags: currentSiteInfo.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleAddSiteInfo = () => {
    if (
      currentSiteInfo.siteName.trim() === "" ||
      currentSiteInfo.siteLink.trim() === ""
    ) {
      return;
    }

    setSiteInfoList([...siteInfoList, { ...currentSiteInfo }]);
    setCurrentSiteInfo({
      siteName: "",
      siteLink: "",
      tags: [],
    });
  };

  const handleRemoveSiteInfo = (index: number) => {
    setSiteInfoList(siteInfoList.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!movie.firestoreId) {
        throw new Error("Missing Firestore document ID");
      }

      // Convert string arrays to actual arrays
      const genresArray = formData.genres.split(",").map((g) => g.trim());
      const starsArray = formData.stars.split(",").map((s) => s.trim());

      // Create the updated movie object
      const updatedMovie = {
        ...movie,
        title: formData.title,
        posterPath: formData.posterPath,
        rating: parseFloat(formData.rating.toString()),
        year: formData.year,
        genres: genresArray,
        description: formData.description,
        director: formData.director,
        stars: starsArray,
        runtime: formData.runtime,
        siteInfo: siteInfoList,
      };

      // Update in Firestore
      await updateMovie(movie.firestoreId, updatedMovie);

      // Notify parent component
      onMovieUpdated(updatedMovie);
    } catch (err) {
      console.error("Error updating movie:", err);
      setError("Failed to update movie. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Edit Movie: {movie.title}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="posterPath"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Poster URL *
            </label>
            <input
              type="text"
              id="posterPath"
              name="posterPath"
              value={formData.posterPath}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="rating"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Rating (0-10) *
            </label>
            <input
              type="number"
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              min="0"
              max="10"
              step="0.1"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="year"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Release Year *
            </label>
            <input
              type="text"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="genres"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Genres (comma separated) *
            </label>
            <input
              type="text"
              id="genres"
              name="genres"
              value={formData.genres}
              onChange={handleChange}
              required
              placeholder="Action, Adventure, Sci-Fi"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Site Information Section */}
        <div className="mt-8 mb-6 border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
            Site Information
          </h3>

          {/* Current Site Info List */}
          {siteInfoList.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Added Sites:
              </h4>
              <div className="space-y-3">
                {siteInfoList.map((site, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
                  >
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {site.siteName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {site.siteLink}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {site.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSiteInfo(index)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Site Info */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="siteName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Site Name
                </label>
                <input
                  type="text"
                  id="siteName"
                  name="siteName"
                  value={currentSiteInfo.siteName}
                  onChange={handleSiteInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="siteLink"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Site Link
                </label>
                <input
                  type="text"
                  id="siteLink"
                  name="siteLink"
                  value={currentSiteInfo.siteLink}
                  onChange={handleSiteInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="mb-4">
              <label
                htmlFor="currentTag"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Tags
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="currentTag"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Add a tag"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add
                </button>
              </div>

              {/* Display current tags */}
              {currentSiteInfo.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentSiteInfo.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 dark:hover:text-indigo-100"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleAddSiteInfo}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Add Site Information
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full p-2 border rounded-md"
          ></textarea>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Updating..." : "Update Movie"}
          </button>
        </div>
      </form>
    </div>
  );
}
