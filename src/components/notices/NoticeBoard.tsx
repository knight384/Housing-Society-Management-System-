import React, { useState } from "react";
import { useSociety } from "../../context/SocietyContext";
import { NoticePost, CommunityPoll } from "../../types";
import {
  Megaphone,
  Pin,
  Heart,
  MessageSquare,
  Sparkles,
  Plus,
  Vote,
  CheckCircle2,
  Trash2,
  X,
  Search,
  Filter,
  Loader2
} from "lucide-react";

export const NoticeBoard: React.FC = () => {
  const {
    currentUser,
    notices,
    polls,
    addNotice,
    likeNotice,
    votePoll
  } = useSociety();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // AI Notice Modal state
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [noticeTopic, setNoticeTopic] = useState("");
  const [noticeCategory, setNoticeCategory] = useState<NoticePost['category']>("General");
  const [noticeContent, setNoticeContent] = useState("");
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeSummary, setNoticeSummary] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const filteredNotices = notices.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "All" || n.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleGenerateAiNotice = async () => {
    if (!noticeTopic) return;
    setIsGeneratingAi(true);

    try {
      const res = await fetch("/api/ai/notice-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: noticeTopic,
          category: noticeCategory,
          targetAudience: "All Grand Vista Residents"
        })
      });
      const data = await res.json();
      if (data.title) {
        setNoticeTitle(data.title);
        setNoticeContent(data.content);
        setNoticeSummary(data.summary || data.title);
      }
    } catch {
      setNoticeTitle(`Announcement: ${noticeTopic}`);
      setNoticeContent(`Notice regarding ${noticeTopic}. Please follow society RWA directives.`);
      setNoticeSummary(`Notice regarding ${noticeTopic}`);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handlePublishNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle || !noticeContent) return;
    addNotice(noticeTitle, noticeContent, noticeSummary || noticeTitle, noticeCategory, isPinned);
    setShowNoticeModal(false);
    setNoticeTopic("");
    setNoticeTitle("");
    setNoticeContent("");
    setNoticeSummary("");
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Megaphone className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900">Digital Notice Board & Community Hub</h1>
          </div>
          <p className="text-xs text-slate-600">
            Official announcements, emergency directives, cultural events, and community voting polls.
          </p>
        </div>

        {/* Publish Action Button */}
        <button
          id="btn-open-notice-modal"
          onClick={() => setShowNoticeModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition shrink-0"
        >
          <Sparkles className="w-4 h-4 text-blue-200" />
          <span>Draft Announcement (AI Assisted)</span>
        </button>
      </div>

      {/* Community Polls Section */}
      {polls.length > 0 && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Vote className="w-5 h-5 text-amber-600" />
            <h2 className="font-bold text-base text-slate-900">Active Community Poll</h2>
          </div>

          {polls.map(poll => (
            <div key={poll.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-sm text-slate-900">{poll.question}</h3>
                <span className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full font-mono font-semibold">
                  {poll.totalVotes} Total Votes
                </span>
              </div>

              <div className="space-y-2">
                {poll.options.map(opt => {
                  const pct = poll.totalVotes > 0 ? Math.round((opt.votesCount / poll.totalVotes) * 100) : 0;
                  const hasVoted = opt.votedBy.includes(currentUser.unitNumber);

                  return (
                    <button
                      key={opt.id}
                      onClick={() => votePoll(poll.id, opt.id)}
                      className={`w-full p-3 rounded-xl border text-left text-xs transition relative overflow-hidden group ${
                        hasVoted
                          ? "bg-blue-50 border-blue-300 text-blue-900 font-bold"
                          : "bg-white border-slate-200 text-slate-800 hover:bg-slate-100"
                      }`}
                    >
                      {/* Background Progress Bar */}
                      <div
                        className="absolute left-0 top-0 bottom-0 bg-blue-100/60 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                      <div className="relative z-10 flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          {hasVoted && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                          <span>{opt.text}</span>
                        </span>
                        <span className="font-mono text-slate-500 font-semibold ml-2">{pct}% ({opt.votesCount})</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search & Categories */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/80 p-3.5 rounded-xl shadow-xs">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs overflow-x-auto scrollbar-none">
          {["All", "Emergency", "Maintenance", "Event", "General", "Rules"].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full font-medium transition whitespace-nowrap ${
                selectedCategory === cat ? "bg-slate-900 text-white shadow-xs" : "bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notice Feed */}
      <div className="space-y-4">
        {filteredNotices.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs bg-white border border-slate-200/80 rounded-2xl">
            <Megaphone className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p>No notices matching search criteria.</p>
          </div>
        ) : (
          filteredNotices.map(notice => (
            <div
              key={notice.id}
              className={`bg-white border rounded-2xl p-6 shadow-xs transition space-y-3 relative hover:shadow-md ${
                notice.category === "Emergency" ? "border-rose-300 bg-rose-50/20" : "border-slate-200/80"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    notice.category === "Emergency" ? "bg-rose-50 text-rose-700 border border-rose-200" :
                    notice.category === "Maintenance" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                    "bg-blue-50 text-blue-700 border border-blue-200"
                  }`}>
                    {notice.category}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">{notice.date}</span>
                </div>

                {notice.isPinned && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                    <Pin className="w-3 h-3 text-blue-600" />
                    <span>Pinned</span>
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-slate-900">{notice.title}</h3>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{notice.content}</p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Author: <strong className="text-slate-900">{notice.author}</strong></span>
                
                <button
                  onClick={() => likeNotice(notice.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl transition border ${
                    notice.likedBy.includes(currentUser.unitNumber)
                      ? "bg-rose-50 text-rose-700 border-rose-200 font-bold"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${notice.likedBy.includes(currentUser.unitNumber) ? "fill-rose-500 text-rose-500" : ""}`} />
                  <span>{notice.likesCount} Likes</span>
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      {/* AI Draft Notice Modal */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-[#0b1120]/95 backdrop-blur-2xl border border-white/10 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl text-slate-100 p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-base text-white">Publish Society Announcement</h3>
              </div>
              <button onClick={() => setShowNoticeModal(false)} className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/10">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Generator Bar */}
            <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-2xl space-y-2">
              <p className="text-xs font-semibold text-blue-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>AI Notice Drafting Assistant (Gemini Powered)</span>
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter topic e.g. Water Tank Cleaning on Sunday..."
                  value={noticeTopic}
                  onChange={e => setNoticeTopic(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500/50"
                />
                <button
                  type="button"
                  onClick={handleGenerateAiNotice}
                  disabled={isGeneratingAi || !noticeTopic}
                  className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition disabled:opacity-50 shrink-0"
                >
                  {isGeneratingAi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>Generate</span>
                </button>
              </div>
            </div>

            {/* Notice Edit Form */}
            <form onSubmit={handlePublishNotice} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Category</label>
                <select
                  value={noticeCategory}
                  onChange={e => setNoticeCategory(e.target.value as any)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                >
                  <option value="General" className="bg-[#0b1120]">General</option>
                  <option value="Maintenance" className="bg-[#0b1120]">Maintenance</option>
                  <option value="Emergency" className="bg-[#0b1120]">Emergency</option>
                  <option value="Event" className="bg-[#0b1120]">Event</option>
                  <option value="Rules" className="bg-[#0b1120]">Rules</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Notice Title</label>
                <input
                  type="text"
                  value={noticeTitle}
                  onChange={e => setNoticeTitle(e.target.value)}
                  placeholder="Title of announcement..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500/50 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Detailed Content</label>
                <textarea
                  rows={4}
                  value={noticeContent}
                  onChange={e => setNoticeContent(e.target.value)}
                  placeholder="Announcement body text..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500/50"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="chk-pinned"
                  checked={isPinned}
                  onChange={e => setIsPinned(e.target.checked)}
                  className="rounded border-white/20 bg-white/5 text-blue-500 focus:ring-0"
                />
                <label htmlFor="chk-pinned" className="text-slate-300 font-medium">Pin this post to the top of notice board</label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition mt-2"
              >
                Publish Notice to Resident Portal & Mobile App
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
