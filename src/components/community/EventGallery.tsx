import React, { useState } from "react";
import { useSociety } from "../../context/SocietyContext";
import { EventAlbum, GalleryPhoto, GalleryPhotoComment } from "../../types";
import {
  Camera,
  Image as ImageIcon,
  FolderOpen,
  Images,
  Plus,
  Search,
  Filter,
  Heart,
  MessageSquare,
  Share2,
  Download,
  Calendar,
  MapPin,
  ShieldCheck,
  Tag,
  X,
  ChevronLeft,
  ChevronRight,
  Send,
  Sparkles,
  Award,
  CheckCircle2,
  Trash2,
  Clock,
  Layers,
  Upload,
  UserCheck
} from "lucide-react";

export const EventGallery: React.FC = () => {
  const { currentUser, triggerPushNotification, logAuditAction } = useSociety();

  // Selected Album Filter (null = show all albums or all photo stream)
  const [viewMode, setViewMode] = useState<"albums" | "photos">("albums");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeAlbumId, setActiveAlbumId] = useState<string | null>(null);

  // Lightbox Modal State
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);
  const [newCommentText, setNewCommentText] = useState<string>("");

  // Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCaption, setUploadCaption] = useState("");
  const [uploadCategory, setUploadCategory] = useState<GalleryPhoto["category"]>("Festival");
  const [uploadAlbumId, setUploadAlbumId] = useState<string>("alb-1");
  const [uploadNewAlbumTitle, setUploadNewAlbumTitle] = useState("");
  const [uploadImageUrl, setUploadImageUrl] = useState("");
  const [uploadLocation, setUploadLocation] = useState("");
  const [uploadTags, setUploadTags] = useState("");
  const [isManagementOfficial, setIsManagementOfficial] = useState(true);

  // Mock Albums Data
  const [albums, setAlbums] = useState<EventAlbum[]>([
    {
      id: "alb-1",
      title: "Diwali Grand Light & Cultural Fest 2025",
      category: "Festival",
      date: "2025-11-01",
      location: "Central Courtyard & Amphitheatre",
      coverPhotoUrl: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=800&auto=format&fit=crop&q=80",
      description: "Annual society Diwali celebration featuring traditional rangoli competitions, laser light show, youth dance performances, and community buffet.",
      photoCount: 6,
      uploadedBy: "RWA Cultural Committee",
      tags: ["Diwali2025", "Rangoli", "Fireworks", "StagePerformances"]
    },
    {
      id: "alb-2",
      title: "Annual General Body Meeting (AGM 2025)",
      category: "Meeting & AGM",
      date: "2025-10-15",
      location: "Grand Clubhouse Auditorium",
      coverPhotoUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80",
      description: "Official RWA Board presentation of financial audit, solar energy savings report, security upgrades roadmap, and new committee elections.",
      photoCount: 4,
      uploadedBy: "RWA Management Board",
      tags: ["AGM2025", "RWAMeeting", "BudgetReview", "Audit"]
    },
    {
      id: "alb-3",
      title: "Holi Organic Color & Rain Dance 2025",
      category: "Festival",
      date: "2025-03-25",
      location: "Main Lawn & Poolside Deck",
      coverPhotoUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&auto=format&fit=crop&q=80",
      description: "Vibrant Holi celebrations with eco-friendly herbal gulal, live DJ sound system, rain dance shower setup, and thandai refreshments.",
      photoCount: 5,
      uploadedBy: "RWA Youth Club",
      tags: ["Holi2025", "OrganicGulal", "RainDance", "DJNight"]
    },
    {
      id: "alb-4",
      title: "79th Independence Day Flag Hoisting",
      category: "Community Social",
      date: "2025-08-15",
      location: "Gate 1 Ceremony Plaza",
      coverPhotoUrl: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=800&auto=format&fit=crop&q=80",
      description: "Patriotic morning flag ceremony with security guard march past, children's anthem singing, senior citizens honors, and sweet distribution.",
      photoCount: 4,
      uploadedBy: "RWA Management Board",
      tags: ["IndependenceDay", "FlagHoisting", "Patriotic", "GuardHonors"]
    },
    {
      id: "alb-5",
      title: "Monsoon Eco Tree Plantation & Green Drive",
      category: "Environment & Green",
      date: "2025-07-20",
      location: "Peripheral Boundary Gardens",
      coverPhotoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
      description: "Resident volunteers planted 150 flowering saplings and medicinal plants. Organic compost workshop conducted by Eco Committee.",
      photoCount: 4,
      uploadedBy: "Green Environment Cell",
      tags: ["GoGreen", "TreePlantation", "MonsoonDrive", "EcoFriendly"]
    },
    {
      id: "alb-6",
      title: "Summer Youth Badminton Tournament",
      category: "Sports & Youth",
      date: "2025-05-10",
      location: "Indoor Sports Complex",
      coverPhotoUrl: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80",
      description: "3-day knockout championship across Singles and Doubles categories. Trophy distribution by RWA Sports Secretary.",
      photoCount: 4,
      uploadedBy: "RWA Sports Committee",
      tags: ["Badminton2025", "SportsTournament", "YouthChampions"]
    }
  ]);

  // Mock Gallery Photos Data
  const [photos, setPhotos] = useState<GalleryPhoto[]>([
    {
      id: "ph-101",
      albumId: "alb-1",
      title: "Grand Entrance Illumination & Floral Arch",
      caption: "Tower A & Main Gate illuminated with fairy lights and traditional marigold floral decorations.",
      imageUrl: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=1000&auto=format&fit=crop&q=80",
      dateUploaded: "2025-11-02",
      uploadedBy: "RWA Cultural Committee",
      isManagementUpload: true,
      category: "Festival",
      likesCount: 42,
      likedByCurrentUser: false,
      comments: [
        { id: "c-1", user: "Anita Sharma", unitNumber: "A-402", text: "The gate lighting looked absolutely magical this year!", date: "2025-11-02" },
        { id: "c-2", user: "Mark Vance", unitNumber: "B-101", text: "Kudos to the estate team for setting this up so cleanly.", date: "2025-11-02" }
      ],
      tags: ["Diwali2025", "Lighting", "Decorations"]
    },
    {
      id: "ph-102",
      albumId: "alb-1",
      title: "Rangoli Competition Winner Design",
      caption: "1st Place winning Rangoli by Tower C Residents depicting a peacock in vibrant natural color powders.",
      imageUrl: "https://images.unsplash.com/photo-1605007493699-af65834f8a00?w=1000&auto=format&fit=crop&q=80",
      dateUploaded: "2025-11-02",
      uploadedBy: "RWA Cultural Committee",
      isManagementUpload: true,
      category: "Festival",
      likesCount: 38,
      likedByCurrentUser: true,
      comments: [
        { id: "c-3", user: "Priya Patel", unitNumber: "C-202", text: "Congratulations Tower C team! Beautiful intricate work.", date: "2025-11-02" }
      ],
      tags: ["Rangoli", "Art", "Winners"]
    },
    {
      id: "ph-103",
      albumId: "alb-1",
      title: "Amphitheatre Stage Dance Performance",
      caption: "Society kids group performing classic folk dances during the evening cultural showcase.",
      imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1000&auto=format&fit=crop&q=80",
      dateUploaded: "2025-11-02",
      uploadedBy: "RWA Cultural Committee",
      isManagementUpload: true,
      category: "Festival",
      likesCount: 29,
      likedByCurrentUser: false,
      comments: [],
      tags: ["Dance", "CulturalNight", "KidsPerformance"]
    },
    {
      id: "ph-104",
      albumId: "alb-1",
      title: "Eco-Friendly Fireworks & Sparkler Show",
      caption: "Controlled green fireworks display in the open sports ground organized safely with fire marshals.",
      imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1000&auto=format&fit=crop&q=80",
      dateUploaded: "2025-11-02",
      uploadedBy: "RWA Management Board",
      isManagementUpload: true,
      category: "Festival",
      likesCount: 51,
      likedByCurrentUser: false,
      comments: [
        { id: "c-4", user: "David Miller", unitNumber: "A-504", text: "Green fireworks were a thoughtful eco choice!", date: "2025-11-03" }
      ],
      tags: ["Fireworks", "EcoFriendly", "NightShow"]
    },

    // AGM Photos
    {
      id: "ph-201",
      albumId: "alb-2",
      title: "AGM Opening Address by RWA President",
      caption: "President presenting the FY25-26 annual development budget and solar rooftop progress report.",
      imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1000&auto=format&fit=crop&q=80",
      dateUploaded: "2025-10-16",
      uploadedBy: "RWA Management Board",
      isManagementUpload: true,
      category: "Meeting & AGM",
      likesCount: 24,
      likedByCurrentUser: false,
      comments: [
        { id: "c-5", user: "Robert Chen", unitNumber: "B-303", text: "Very transparent presentation. Glad to see solar savings live.", date: "2025-10-16" }
      ],
      tags: ["AGM2025", "RWAPresident", "Audit"]
    },
    {
      id: "ph-202",
      albumId: "alb-2",
      title: "Resident Question & Answer Session",
      caption: "Open forum floor discussion regarding EV charging stations in basement parking and lift modernizations.",
      imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1000&auto=format&fit=crop&q=80",
      dateUploaded: "2025-10-16",
      uploadedBy: "RWA Management Board",
      isManagementUpload: true,
      category: "Meeting & AGM",
      likesCount: 19,
      likedByCurrentUser: false,
      comments: [],
      tags: ["QandA", "ResidentFeedback", "Townhall"]
    },

    // Holi Photos
    {
      id: "ph-301",
      albumId: "alb-3",
      title: "Main Lawn Color Celebration & DJ Dance",
      caption: "Residents celebrating with 100% herbal organic gulal on the main clubhouse lawn deck.",
      imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1000&auto=format&fit=crop&q=80",
      dateUploaded: "2025-03-26",
      uploadedBy: "RWA Youth Club",
      isManagementUpload: true,
      category: "Festival",
      likesCount: 65,
      likedByCurrentUser: true,
      comments: [
        { id: "c-6", user: "Sneha Kapoor", unitNumber: "C-104", text: "Best Holi ever! The organic colors washed off easily.", date: "2025-03-26" }
      ],
      tags: ["Holi2025", "Colors", "FestiveVibes"]
    },
    {
      id: "ph-302",
      albumId: "alb-3",
      title: "Poolside Rain Shower & Thandai Stalls",
      caption: "Complimentary traditional thandai and snacks distribution organized by the catering committee.",
      imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1000&auto=format&fit=crop&q=80",
      dateUploaded: "2025-03-26",
      uploadedBy: "RWA Youth Club",
      isManagementUpload: true,
      category: "Festival",
      likesCount: 44,
      likedByCurrentUser: false,
      comments: [],
      tags: ["RainDance", "Thandai", "ClubhousePool"]
    },

    // Independence Day Photos
    {
      id: "ph-401",
      albumId: "alb-4",
      title: "Tri-Color Flag Hoisting Ceremony",
      caption: "Unfurling of the national flag by senior resident Dr. K.S. Rao accompanied by national anthem salute.",
      imageUrl: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=1000&auto=format&fit=crop&q=80",
      dateUploaded: "2025-08-15",
      uploadedBy: "RWA Management Board",
      isManagementUpload: true,
      category: "Community Social",
      likesCount: 58,
      likedByCurrentUser: true,
      comments: [
        { id: "c-7", user: "Suresh Menon", unitNumber: "A-201", text: "Proud moment for Grand Vista Heights family!", date: "2025-08-15" }
      ],
      tags: ["IndependenceDay", "FlagHoisting", "Patriotic"]
    },
    {
      id: "ph-402",
      albumId: "alb-4",
      title: "Security Guard March Past & Commendations",
      caption: "Honoring our 12 security team guards with excellence medals and festival bonus checks.",
      imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1000&auto=format&fit=crop&q=80",
      dateUploaded: "2025-08-15",
      uploadedBy: "RWA Management Board",
      isManagementUpload: true,
      category: "Community Social",
      likesCount: 37,
      likedByCurrentUser: false,
      comments: [],
      tags: ["SecurityHeroes", "GuardHonors", "RWA"]
    },

    // Green Drive Photos
    {
      id: "ph-501",
      albumId: "alb-5",
      title: "Resident Volunteers Planting Flowering Saplings",
      caption: "Children and parents planting Neem, Gulmohar, and Jacaranda saplings along Peripheral Walkway.",
      imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1000&auto=format&fit=crop&q=80",
      dateUploaded: "2025-07-21",
      uploadedBy: "Green Environment Cell",
      isManagementUpload: true,
      category: "Environment & Green",
      likesCount: 33,
      likedByCurrentUser: false,
      comments: [
        { id: "c-8", user: "Elena Rostova", unitNumber: "C-305", text: "Looking forward to seeing these trees grow full bloom next summer!", date: "2025-07-21" }
      ],
      tags: ["GoGreen", "TreePlantation", "Nature"]
    },

    // Badminton Tournament
    {
      id: "ph-601",
      albumId: "alb-6",
      title: "Men's Singles Championship Match",
      caption: "Thrilling 3-set final match between Flat B-204 and A-102 in the indoor court.",
      imageUrl: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1000&auto=format&fit=crop&q=80",
      dateUploaded: "2025-05-11",
      uploadedBy: "RWA Sports Committee",
      isManagementUpload: true,
      category: "Sports & Youth",
      likesCount: 28,
      likedByCurrentUser: false,
      comments: [],
      tags: ["Badminton", "FinalMatch", "SportsArena"]
    }
  ]);

  // Handle Like Toggle
  const handleToggleLike = (photoId: string) => {
    setPhotos(prev =>
      prev.map(p => {
        if (p.id === photoId) {
          const liked = !p.likedByCurrentUser;
          return {
            ...p,
            likedByCurrentUser: liked,
            likesCount: liked ? p.likesCount + 1 : p.likesCount - 1
          };
        }
        return p;
      })
    );

    if (activePhoto && activePhoto.id === photoId) {
      const liked = !activePhoto.likedByCurrentUser;
      setActivePhoto({
        ...activePhoto,
        likedByCurrentUser: liked,
        likesCount: liked ? activePhoto.likesCount + 1 : activePhoto.likesCount - 1
      });
    }
  };

  // Handle Add Comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePhoto || !newCommentText.trim()) return;

    const newComment: GalleryPhotoComment = {
      id: "c-" + Date.now(),
      user: currentUser.name,
      unitNumber: currentUser.unitNumber,
      text: newCommentText.trim(),
      date: new Date().toISOString().split("T")[0]
    };

    const updatedComments = [...activePhoto.comments, newComment];

    setPhotos(prev =>
      prev.map(p => (p.id === activePhoto.id ? { ...p, comments: updatedComments } : p))
    );

    setActivePhoto({
      ...activePhoto,
      comments: updatedComments
    });

    setNewCommentText("");
  };

  // Handle Upload New Photo/Album by Management
  const handlePublishUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle || !uploadImageUrl) return;

    let targetAlbumId = uploadAlbumId;
    let targetAlbumTitle = "";

    // If user typed a new album title
    if (uploadAlbumId === "NEW" && uploadNewAlbumTitle) {
      const newAlbumId = "alb-" + Date.now();
      const newAlbum: EventAlbum = {
        id: newAlbumId,
        title: uploadNewAlbumTitle,
        category: uploadCategory,
        date: new Date().toISOString().split("T")[0],
        location: uploadLocation || "Society Premises",
        coverPhotoUrl: uploadImageUrl,
        description: uploadCaption || "Management event album uploaded to gallery.",
        photoCount: 1,
        uploadedBy: isManagementOfficial ? "RWA Management Board" : `${currentUser.name} (${currentUser.unitNumber})`,
        tags: uploadTags ? uploadTags.split(",").map(t => t.trim()) : ["SocietyEvent"]
      };

      setAlbums(prev => [newAlbum, ...prev]);
      targetAlbumId = newAlbumId;
      targetAlbumTitle = uploadNewAlbumTitle;
    } else {
      const existing = albums.find(a => a.id === uploadAlbumId);
      targetAlbumTitle = existing ? existing.title : "Society Gallery";
      // Increment photo count in album
      setAlbums(prev =>
        prev.map(a => (a.id === uploadAlbumId ? { ...a, photoCount: a.photoCount + 1 } : a))
      );
    }

    const newPhoto: GalleryPhoto = {
      id: "ph-" + Date.now(),
      albumId: targetAlbumId,
      title: uploadTitle,
      caption: uploadCaption,
      imageUrl: uploadImageUrl,
      dateUploaded: new Date().toISOString().split("T")[0],
      uploadedBy: isManagementOfficial ? "RWA Management Board" : `${currentUser.name} (${currentUser.unitNumber})`,
      isManagementUpload: isManagementOfficial,
      category: uploadCategory,
      likesCount: 1,
      likedByCurrentUser: true,
      comments: [],
      tags: uploadTags ? uploadTags.split(",").map(t => t.trim()) : ["ManagementVerified"]
    };

    setPhotos(prev => [newPhoto, ...prev]);
    setShowUploadModal(false);

    // Reset Form
    setUploadTitle("");
    setUploadCaption("");
    setUploadImageUrl("");
    setUploadLocation("");
    setUploadTags("");
    setUploadNewAlbumTitle("");

    triggerPushNotification(
      `📸 New Event Photos Published: ${targetAlbumTitle}`,
      `RWA Management uploaded new event photos ("${uploadTitle}") to the official Society Gallery.`,
      "Notice"
    );

    logAuditAction(
      "UPLOAD_EVENT_PHOTO",
      `Management uploaded photo '${uploadTitle}' to album '${targetAlbumTitle}'`
    );
  };

  // Handle Image File Upload Conversion to Base64
  const handlePhotoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Filter Albums & Photos
  const filteredAlbums = albums.filter(alb => {
    if (selectedCategory !== "All" && alb.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        alb.title.toLowerCase().includes(q) ||
        alb.description.toLowerCase().includes(q) ||
        alb.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const filteredPhotos = photos.filter(ph => {
    if (activeAlbumId && ph.albumId !== activeAlbumId) return false;
    if (selectedCategory !== "All" && ph.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        ph.title.toLowerCase().includes(q) ||
        (ph.caption && ph.caption.toLowerCase().includes(q)) ||
        ph.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Lightbox Navigation inside filtered photos
  const currentPhotoIndex = activePhoto ? filteredPhotos.findIndex(p => p.id === activePhoto.id) : -1;
  const handlePrevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setActivePhoto(filteredPhotos[currentPhotoIndex - 1]);
    }
  };
  const handleNextPhoto = () => {
    if (currentPhotoIndex < filteredPhotos.length - 1) {
      setActivePhoto(filteredPhotos[currentPhotoIndex + 1]);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER BAR */}
      <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-amber-500 to-rose-600 rounded-xl text-white shadow-xs">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">Society Event & Festival Gallery</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Official management archives, festival photo albums, AGM records, and community memories.
              </p>
            </div>
          </div>
        </div>

        <button
          id="btn-upload-gallery-photo"
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-xs shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Upload Management Photos</span>
        </button>
      </div>

      {/* QUICK STATS METRICS BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-3.5 rounded-xl border border-slate-700/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Event Albums</p>
            <p className="text-xl font-black font-mono text-amber-400 mt-0.5">{albums.length}</p>
          </div>
          <FolderOpen className="w-6 h-6 text-slate-400" />
        </div>

        <div className="bg-white border border-slate-200/80 p-3.5 rounded-xl shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Photos</p>
            <p className="text-xl font-black font-mono text-slate-900 mt-0.5">{photos.length}</p>
          </div>
          <ImageIcon className="w-6 h-6 text-blue-500" />
        </div>

        <div className="bg-emerald-50/80 border border-emerald-200/80 p-3.5 rounded-xl shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">RWA Management Uploads</p>
            <p className="text-xl font-black font-mono text-emerald-900 mt-0.5">
              {photos.filter(p => p.isManagementUpload).length}
            </p>
          </div>
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
        </div>

        <div className="bg-rose-50/80 border border-rose-200/80 p-3.5 rounded-xl shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">Resident Likes</p>
            <p className="text-xl font-black font-mono text-rose-900 mt-0.5">
              {photos.reduce((sum, p) => sum + p.likesCount, 0)}
            </p>
          </div>
          <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
        </div>
      </div>

      {/* NAVIGATION TABS & FILTERS */}
      <div className="bg-white border border-slate-200/80 p-3.5 rounded-2xl shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* View Switcher Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-full sm:w-auto shrink-0">
            <button
              onClick={() => {
                setViewMode("albums");
                setActiveAlbumId(null);
              }}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                viewMode === "albums" && !activeAlbumId
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
              <span>Event Albums ({albums.length})</span>
            </button>

            <button
              onClick={() => {
                setViewMode("photos");
                setActiveAlbumId(null);
              }}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                viewMode === "photos" && !activeAlbumId
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-blue-500" />
              <span>All Photos Stream ({photos.length})</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search albums, festival photos, tags..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto text-[11px] font-bold pt-1 border-t border-slate-100">
          <span className="text-slate-400 text-[10px] uppercase font-mono mr-1 shrink-0">Category:</span>
          {[
            "All",
            "Festival",
            "Meeting & AGM",
            "Sports & Youth",
            "Cultural Night",
            "Environment & Green",
            "Community Social"
          ].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full transition whitespace-nowrap border ${
                selectedCategory === cat
                  ? "bg-amber-500 text-slate-950 font-extrabold border-amber-500 shadow-xs"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ALBUM FILTER BREADCRUMB IF INSIDE AN ALBUM */}
      {activeAlbumId && (
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-amber-700" />
            <span className="text-xs font-bold text-amber-950">
              Viewing Photos for Album:{" "}
              <strong className="underline">{albums.find(a => a.id === activeAlbumId)?.title}</strong>
            </span>
          </div>
          <button
            onClick={() => setActiveAlbumId(null)}
            className="text-xs font-bold text-amber-900 hover:text-amber-950 flex items-center gap-1 underline"
          >
            <span>Back to All Albums</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ALBUMS GRID VIEW */}
      {viewMode === "albums" && !activeAlbumId && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Curated Society Event Albums</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">Showing {filteredAlbums.length} albums</span>
          </div>

          {filteredAlbums.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-3">
              <FolderOpen className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">No Event Albums Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try clearing your search keyword or switching category filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredAlbums.map(album => {
                const albumPhotos = photos.filter(p => p.albumId === album.id);
                return (
                  <div
                    key={album.id}
                    onClick={() => {
                      setActiveAlbumId(album.id);
                      setViewMode("photos");
                    }}
                    className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition duration-300 cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      {/* Album Cover Photo */}
                      <div className="relative h-48 bg-slate-900 overflow-hidden">
                        <img
                          src={album.coverPhotoUrl}
                          alt={album.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-slate-900/90 text-amber-400 border border-amber-400/30 uppercase tracking-wider shadow-sm">
                            {album.category}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-white/90 text-slate-900 flex items-center gap-1 shadow-sm">
                            <ImageIcon className="w-3 h-3 text-blue-600" />
                            <span>{albumPhotos.length || album.photoCount} Photos</span>
                          </span>
                        </div>

                        {/* Bottom Title on Image */}
                        <div className="absolute bottom-3 left-3 right-3 text-white space-y-1">
                          <h3 className="font-bold text-base leading-snug line-clamp-1 group-hover:text-amber-300 transition">
                            {album.title}
                          </h3>
                          <div className="flex items-center gap-2 text-[11px] text-slate-200 font-medium">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-amber-400" />
                              {album.date}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 truncate">
                              <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                              <span className="truncate">{album.location}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Album Description */}
                      <div className="p-4 space-y-3">
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                          {album.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {album.tags.map((t, i) => (
                            <span key={i} className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Album Footer */}
                    <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
                      <span className="flex items-center gap-1 text-[11px]">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="truncate">{album.uploadedBy}</span>
                      </span>

                      <span className="text-amber-600 group-hover:translate-x-0.5 transition font-bold flex items-center gap-1 text-xs">
                        <span>Open Album</span>
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* PHOTOS MASONRY / GRID VIEW */}
      {(viewMode === "photos" || activeAlbumId) && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-blue-600" />
              <span>
                {activeAlbumId
                  ? `Album Photos (${filteredPhotos.length})`
                  : `All Community Event Photos (${filteredPhotos.length})`}
              </span>
            </h2>
            <span className="text-xs text-slate-500">Click any photo to open full lightbox viewer</span>
          </div>

          {filteredPhotos.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-3">
              <Camera className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">No Photos Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No photos match the selected filters. Upload new photos using the Management button above!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredPhotos.map(photo => (
                <div
                  key={photo.id}
                  onClick={() => setActivePhoto(photo)}
                  className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition duration-300 cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    {/* Thumbnail Image */}
                    <div className="relative h-44 bg-slate-900 overflow-hidden">
                      <img
                        src={photo.imageUrl}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        referrerPolicy="no-referrer"
                      />

                      {/* Management Verified Badge */}
                      {photo.isManagementUpload && (
                        <div className="absolute top-2 left-2 bg-slate-900/90 text-emerald-400 border border-emerald-400/30 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 backdrop-blur-xs">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          <span>Management</span>
                        </div>
                      )}

                      {/* Category Badge */}
                      <div className="absolute top-2 right-2 bg-slate-900/80 text-white px-2 py-0.5 rounded-md text-[10px] font-bold backdrop-blur-xs">
                        {photo.category}
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white gap-3">
                        <span className="p-2 rounded-full bg-white/20 backdrop-blur-md">
                          <Sparkles className="w-5 h-5 text-amber-300" />
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-3 space-y-1.5">
                      <h3 className="font-bold text-xs text-slate-900 line-clamp-1 group-hover:text-blue-600 transition">
                        {photo.title}
                      </h3>
                      {photo.caption && (
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">
                          {photo.caption}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Interaction Footer */}
                  <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleToggleLike(photo.id);
                      }}
                      className={`flex items-center gap-1 font-bold transition ${
                        photo.likedByCurrentUser ? "text-rose-600" : "text-slate-500 hover:text-rose-600"
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${photo.likedByCurrentUser ? "fill-rose-600" : ""}`} />
                      <span>{photo.likesCount}</span>
                    </button>

                    <div className="flex items-center gap-1 text-slate-400 font-medium">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                      <span>{photo.comments.length}</span>
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono">
                      {photo.dateUploaded}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX & COMMENTS MODAL */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-2 sm:p-6 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col lg:flex-row overflow-hidden shadow-2xl relative text-white">
            
            {/* Close Button */}
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition"
              title="Close Lightbox"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Column: Image Viewer with Prev/Next Controls */}
            <div className="flex-1 bg-black relative flex items-center justify-center min-h-[300px] lg:min-h-full">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                className="max-h-full max-w-full object-contain"
                referrerPolicy="no-referrer"
              />

              {/* Prev / Next Navigation */}
              {currentPhotoIndex > 0 && (
                <button
                  onClick={handlePrevPhoto}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/80 text-white hover:bg-slate-800 transition backdrop-blur-xs border border-slate-700"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              {currentPhotoIndex < filteredPhotos.length - 1 && (
                <button
                  onClick={handleNextPhoto}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/80 text-white hover:bg-slate-800 transition backdrop-blur-xs border border-slate-700"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Right Column: Metadata & Comments Panel */}
            <div className="w-full lg:w-96 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 p-5 flex flex-col justify-between space-y-4 overflow-y-auto">
              
              <div className="space-y-4">
                {/* Header Info */}
                <div className="space-y-2 pt-2 lg:pt-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
                      {activePhoto.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{activePhoto.dateUploaded}</span>
                  </div>

                  <h2 className="font-extrabold text-base leading-snug text-white">{activePhoto.title}</h2>

                  {activePhoto.caption && (
                    <p className="text-xs text-slate-300 leading-relaxed">{activePhoto.caption}</p>
                  )}

                  {/* Uploader Badge */}
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-800 text-xs text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Uploaded by: <strong className="text-emerald-300">{activePhoto.uploadedBy}</strong></span>
                  </div>
                </div>

                {/* Tags */}
                {activePhoto.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {activePhoto.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Interactive Action Bar */}
                <div className="flex items-center justify-between p-3 bg-slate-800/80 rounded-xl border border-slate-700/80">
                  <button
                    onClick={() => handleToggleLike(activePhoto.id)}
                    className={`flex items-center gap-1.5 font-bold text-xs transition ${
                      activePhoto.likedByCurrentUser ? "text-rose-400" : "text-slate-300 hover:text-rose-400"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${activePhoto.likedByCurrentUser ? "fill-rose-500 text-rose-500" : ""}`} />
                    <span>{activePhoto.likesCount} Likes</span>
                  </button>

                  <a
                    href={activePhoto.imageUrl}
                    download={`society-event-${activePhoto.id}.jpg`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200 transition flex items-center gap-1 text-xs font-semibold"
                    title="Download High-Res Photo"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>

                {/* Comments Thread */}
                <div className="space-y-3 pt-2">
                  <h3 className="font-bold text-xs text-slate-300 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                    <span>Resident Comments ({activePhoto.comments.length})</span>
                  </h3>

                  <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                    {activePhoto.comments.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">No comments yet. Be the first to leave a memory!</p>
                    ) : (
                      activePhoto.comments.map(c => (
                        <div key={c.id} className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-800 text-xs space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-slate-200">{c.user} ({c.unitNumber})</span>
                            <span className="text-[10px] text-slate-500">{c.date}</span>
                          </div>
                          <p className="text-slate-300 text-xs">{c.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Add Comment Input */}
              <form onSubmit={handleAddComment} className="flex gap-2 pt-2 border-t border-slate-800">
                <input
                  type="text"
                  placeholder="Share a memory or comment..."
                  value={newCommentText}
                  onChange={e => setNewCommentText(e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition flex items-center justify-center shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

            </div>
          </div>
        </div>
      )}

      {/* MANAGEMENT UPLOAD PHOTO MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 space-y-4 text-slate-900 shadow-xl relative my-8">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base">
                <Camera className="w-5 h-5 text-amber-500" />
                <h3>Upload Event Photos (Management Portal)</h3>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="p-1 rounded-xl text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePublishUpload} className="space-y-4 text-xs">
              
              {/* Official RWA Badge Toggle */}
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <div>
                    <p className="font-bold text-emerald-950">Publish as Official Management Media</p>
                    <p className="text-[10px] text-emerald-700">Adds RWA Management verification seal & push alert</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isManagementOfficial}
                  onChange={e => setIsManagementOfficial(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
              </div>

              {/* Target Album Selection */}
              <div>
                <label className="text-slate-700 block mb-1 font-bold">Select Event Album *</label>
                <select
                  value={uploadAlbumId}
                  onChange={e => setUploadAlbumId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-amber-500"
                >
                  {albums.map(alb => (
                    <option key={alb.id} value={alb.id}>
                      {alb.title} ({alb.category})
                    </option>
                  ))}
                  <option value="NEW">+ Create New Event Album...</option>
                </select>
              </div>

              {/* If NEW Album option selected */}
              {uploadAlbumId === "NEW" && (
                <div>
                  <label className="text-slate-700 block mb-1 font-bold">New Album Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. New Year Gala 2026 / Monsoon Cricket Cup"
                    value={uploadNewAlbumTitle}
                    onChange={e => setUploadNewAlbumTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              )}

              {/* Photo Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1 font-bold">Photo Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Stage Performance / Prize Distribution"
                    value={uploadTitle}
                    onChange={e => setUploadTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1 font-bold">Category *</label>
                  <select
                    value={uploadCategory}
                    onChange={e => setUploadCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-amber-500"
                  >
                    <option value="Festival">Festival</option>
                    <option value="Meeting & AGM">Meeting & AGM</option>
                    <option value="Sports & Youth">Sports & Youth</option>
                    <option value="Cultural Night">Cultural Night</option>
                    <option value="Environment & Green">Environment & Green</option>
                    <option value="Community Social">Community Social</option>
                  </select>
                </div>
              </div>

              {/* Caption */}
              <div>
                <label className="text-slate-700 block mb-1 font-bold">Caption / Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe the moment, winners, or event highlights..."
                  value={uploadCaption}
                  onChange={e => setUploadCaption(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Image Source (Upload File or URL or Presets) */}
              <div>
                <label className="text-slate-700 block mb-1 font-bold">Photo File / Image URL *</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl cursor-pointer text-slate-800 font-bold text-xs flex items-center gap-1.5 transition shrink-0">
                      <Camera className="w-4 h-4 text-amber-600" />
                      <span>Upload File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoFileUpload}
                        className="hidden"
                      />
                    </label>

                    <input
                      type="text"
                      placeholder="Or paste high-res image URL (https://...)"
                      value={uploadImageUrl}
                      onChange={e => setUploadImageUrl(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none text-xs"
                      required
                    />
                  </div>

                  {/* Sample Presets */}
                  <div className="flex items-center gap-1.5 overflow-x-auto text-[10px] text-slate-500 pt-1">
                    <span className="shrink-0 font-medium">Quick sample images:</span>
                    {[
                      { label: "Festival", url: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=1000&auto=format&fit=crop&q=80" },
                      { label: "AGM Stage", url: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1000&auto=format&fit=crop&q=80" },
                      { label: "Sports Final", url: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1000&auto=format&fit=crop&q=80" },
                      { label: "Patriotic", url: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=1000&auto=format&fit=crop&q=80" },
                      { label: "Tree Plant", url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1000&auto=format&fit=crop&q=80" }
                    ].map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setUploadImageUrl(p.url)}
                        className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 shrink-0 font-medium"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>

                  {/* Live Thumbnail Preview */}
                  {uploadImageUrl && (
                    <div className="relative w-full h-32 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 mt-2">
                      <img src={uploadImageUrl} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <button
                        type="button"
                        onClick={() => setUploadImageUrl("")}
                        className="absolute top-2 right-2 p-1 rounded-full bg-slate-900/80 text-white hover:bg-slate-900"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1 font-bold">Event Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Clubhouse Lawn / Main Gate Plaza"
                    value={uploadLocation}
                    onChange={e => setUploadLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1 font-bold">Tags (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Diwali2025, StageShow, RWA"
                    value={uploadTags}
                    onChange={e => setUploadTags(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <Camera className="w-4 h-4 text-amber-400" />
                <span>Publish Photo to Official Gallery</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
