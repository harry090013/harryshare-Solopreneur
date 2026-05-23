'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Save, Plus, Edit, Trash2, Check, X, AlertCircle, RefreshCw, 
  Image as ImageIcon, Coffee, ShoppingBag, Code, Megaphone, 
  Milestone, BookOpen, Layers, Sparkles, Briefcase, Terminal, 
  Heart, Award, ArrowUp, ArrowDown, HelpCircle
} from 'lucide-react';
import MediaDrawer from '@/components/MediaDrawer';

// Preset icons for timeline
const PRESET_ICONS = [
  { name: 'Coffee', label: 'Coffee (Quán cafe/Phục vụ)' },
  { name: 'ShoppingBag', label: 'ShoppingBag (Kinh doanh/Bán hàng/Ecommerce)' },
  { name: 'Code', label: 'Code (Lập trình/Phần mềm)' },
  { name: 'Megaphone', label: 'Megaphone (Marketing/Content)' },
  { name: 'Milestone', label: 'Milestone (Cột mốc/Solopreneur)' },
  { name: 'BookOpen', label: 'BookOpen (Sách/Học tập)' },
  { name: 'Layers', label: 'Layers (Sản phẩm/Tư duy)' },
  { name: 'Sparkles', label: 'Sparkles (Sáng tạo/Ý tưởng)' },
  { name: 'Briefcase', label: 'Briefcase (Công việc/Sự nghiệp)' },
  { name: 'Terminal', label: 'Terminal (Kỹ thuật/Hệ thống)' },
  { name: 'Heart', label: 'Heart (Đam mê/Yêu thích)' },
  { name: 'Award', label: 'Award (Thành tựu/Giải thưởng)' }
];

interface HomepageSetting {
  id: string;
  welcomeText: string;
  title: string;
  description: string;
  pillar1Title: string;
  pillar1Desc: string;
  pillar2Title: string;
  pillar2Desc: string;
  pillar3Title: string;
  pillar3Desc: string;
}

interface AboutSetting {
  id: string;
  title: string;
  subtitle: string;
  avatarUrl: string;
  description: string;
}

interface HeroSlide {
  id: string;
  imageUrl: string;
  order: number;
}

interface AboutTimeline {
  id: string;
  period: string;
  title: string;
  role: string;
  iconName: string;
  description: string;
  lesson: string;
  order: number;
}

interface SettingsClientProps {
  initialHomepageSetting: HomepageSetting | null;
  initialAboutSetting: AboutSetting | null;
  initialSlides: HeroSlide[];
  initialTimeline: AboutTimeline[];
}

export default function SettingsClient({
  initialHomepageSetting,
  initialAboutSetting,
  initialSlides,
  initialTimeline
}: SettingsClientProps) {
  const router = useRouter();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'homepage' | 'slideshow' | 'about' | 'timeline'>('homepage');

  // Status Alerts
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Media Drawer Controls
  const [isMediaDrawerOpen, setIsMediaDrawerOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<'slide' | 'about-avatar' | null>(null);
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);

  // Form States - Homepage
  const [welcomeText, setWelcomeText] = useState(initialHomepageSetting?.welcomeText || '');
  const [homeTitle, setHomeTitle] = useState(initialHomepageSetting?.title || '');
  const [homeDesc, setHomeDesc] = useState(initialHomepageSetting?.description || '');
  const [pillar1Title, setPillar1Title] = useState(initialHomepageSetting?.pillar1Title || '');
  const [pillar1Desc, setPillar1Desc] = useState(initialHomepageSetting?.pillar1Desc || '');
  const [pillar2Title, setPillar2Title] = useState(initialHomepageSetting?.pillar2Title || '');
  const [pillar2Desc, setPillar2Desc] = useState(initialHomepageSetting?.pillar2Desc || '');
  const [pillar3Title, setPillar3Title] = useState(initialHomepageSetting?.pillar3Title || '');
  const [pillar3Desc, setPillar3Desc] = useState(initialHomepageSetting?.pillar3Desc || '');

  // Form States - About Page settings
  const [aboutTitle, setAboutTitle] = useState(initialAboutSetting?.title || '');
  const [aboutSubtitle, setAboutSubtitle] = useState(initialAboutSetting?.subtitle || '');
  const [aboutAvatarUrl, setAboutAvatarUrl] = useState(initialAboutSetting?.avatarUrl || '');
  const [aboutDesc, setAboutDesc] = useState(initialAboutSetting?.description || '');

  // Slideshow States
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides);
  const [newSlideUrl, setNewSlideUrl] = useState('');

  // Timeline States
  const [timeline, setTimeline] = useState<AboutTimeline[]>(initialTimeline);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<AboutTimeline | null>(null);
  
  // Timeline Form States
  const [mPeriod, setMPeriod] = useState('');
  const [mTitle, setMTitle] = useState('');
  const [mRole, setMRole] = useState('');
  const [mIconName, setMIconName] = useState('Coffee');
  const [mDescription, setMDescription] = useState('');
  const [mLesson, setMLesson] = useState('');
  const [mOrder, setMOrder] = useState(0);

  const showToast = (msg: string, type: 'success' | 'error') => {
    if (type === 'success') {
      setSuccess(msg);
      setError(null);
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError(msg);
      setSuccess(null);
      setTimeout(() => setError(null), 5000);
    }
  };

  // 1. Save Homepage settings
  const handleSaveHomepage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'homepage',
          data: {
            welcomeText,
            title: homeTitle,
            description: homeDesc,
            pillar1Title,
            pillar1Desc,
            pillar2Title,
            pillar2Desc,
            pillar3Title,
            pillar3Desc
          }
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Lỗi khi cập nhật cài đặt trang chủ.');
      }

      showToast('Cập nhật cài đặt trang chủ thành công!', 'success');
      router.refresh();
    } catch (err: any) {
      showToast(err.message || 'Lỗi kết nối máy chủ.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Save About settings
  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'about',
          data: {
            title: aboutTitle,
            subtitle: aboutSubtitle,
            avatarUrl: aboutAvatarUrl,
            description: aboutDesc
          }
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Lỗi khi cập nhật cài đặt trang Về Harry.');
      }

      showToast('Cập nhật cài đặt trang Về Harry thành công!', 'success');
      router.refresh();
    } catch (err: any) {
      showToast(err.message || 'Lỗi kết nối máy chủ.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Slideshow Handlers
  const handleAddSlide = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newSlideUrl.trim()) return;

    try {
      const nextOrder = slides.length > 0 ? Math.max(...slides.map(s => s.order)) + 1 : 0;
      const res = await fetch('/api/admin/slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: newSlideUrl,
          order: nextOrder
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Lỗi thêm ảnh slideshow.');
      }

      const newSlide = await res.json();
      setSlides(prev => [...prev, newSlide].sort((a, b) => a.order - b.order));
      setNewSlideUrl('');
      showToast('Đã thêm ảnh vào slideshow thành công!', 'success');
      router.refresh();
    } catch (err: any) {
      showToast(err.message || 'Lỗi kết nối.', 'error');
    }
  };

  const handleDeleteSlide = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa ảnh này khỏi slideshow?')) return;

    try {
      const res = await fetch(`/api/admin/slides/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Lỗi khi xóa slide.');
      }

      setSlides(prev => prev.filter(s => s.id !== id));
      showToast('Đã xóa ảnh khỏi slideshow.', 'success');
      router.refresh();
    } catch (err: any) {
      showToast(err.message || 'Lỗi kết nối.', 'error');
    }
  };

  const handleUpdateSlideOrder = async (id: string, newOrder: number) => {
    try {
      const res = await fetch(`/api/admin/slides/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: newOrder })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Lỗi khi cập nhật thứ tự.');
      }

      const updated = await res.json();
      setSlides(prev => prev.map(s => s.id === id ? updated : s).sort((a, b) => a.order - b.order));
      router.refresh();
    } catch (err: any) {
      showToast(err.message || 'Lỗi kết nối.', 'error');
    }
  };

  // 4. Timeline Milestone Handlers
  const handleOpenMilestoneModal = (milestone: AboutTimeline | null = null) => {
    setEditingMilestone(milestone);
    if (milestone) {
      setMPeriod(milestone.period);
      setMTitle(milestone.title);
      setMRole(milestone.role);
      setMIconName(milestone.iconName);
      setMDescription(milestone.description);
      setMLesson(milestone.lesson);
      setMOrder(milestone.order);
    } else {
      setMPeriod(`Giai đoạn ${timeline.length + 1}`);
      setMTitle('');
      setMRole('');
      setMIconName('Coffee');
      setMDescription('');
      setMLesson('');
      setMOrder(timeline.length > 0 ? Math.max(...timeline.map(t => t.order)) + 1 : 0);
    }
    setIsMilestoneModalOpen(true);
  };

  const handleSaveMilestoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mPeriod || !mTitle || !mRole || !mDescription || !mLesson) {
      alert('Vui lòng nhập đầy đủ các thông tin bắt buộc.');
      return;
    }

    const payload = {
      period: mPeriod,
      title: mTitle,
      role: mRole,
      iconName: mIconName,
      description: mDescription,
      lesson: mLesson,
      order: Number(mOrder)
    };

    try {
      const apiUrl = editingMilestone ? `/api/admin/timeline/${editingMilestone.id}` : '/api/admin/timeline';
      const method = editingMilestone ? 'PUT' : 'POST';

      const res = await fetch(apiUrl, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Có lỗi xảy ra khi lưu chặng đường.');
      }

      const savedMilestone = await res.json();

      if (editingMilestone) {
        setTimeline(prev => prev.map(t => t.id === editingMilestone.id ? savedMilestone : t).sort((a, b) => a.order - b.order));
        showToast('Cập nhật chặng đường thành công!', 'success');
      } else {
        setTimeline(prev => [...prev, savedMilestone].sort((a, b) => a.order - b.order));
        showToast('Tạo chặng đường mới thành công!', 'success');
      }

      setIsMilestoneModalOpen(false);
      setEditingMilestone(null);
      router.refresh();
    } catch (err: any) {
      showToast(err.message || 'Lỗi kết nối máy chủ.', 'error');
    }
  };

  const handleDeleteMilestone = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa chặng đường này không?')) return;

    try {
      const res = await fetch(`/api/admin/timeline/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Có lỗi xảy ra khi xóa chặng đường.');
      }

      setTimeline(prev => prev.filter(t => t.id !== id));
      showToast('Xóa chặng đường thành công!', 'success');
      router.refresh();
    } catch (err: any) {
      showToast(err.message || 'Lỗi kết nối.', 'error');
    }
  };

  // Media select callbacks
  const handleOpenMediaForAvatar = () => {
    setMediaTarget('about-avatar');
    setIsMediaDrawerOpen(true);
  };

  const handleOpenMediaForNewSlide = () => {
    setMediaTarget('slide');
    setIsMediaDrawerOpen(true);
  };

  const handleMediaSelect = (url: string) => {
    if (mediaTarget === 'about-avatar') {
      setAboutAvatarUrl(url);
    } else if (mediaTarget === 'slide') {
      setNewSlideUrl(url);
    }
    setIsMediaDrawerOpen(false);
    setMediaTarget(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Toast Messages */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 animate-slide-up text-sm font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 animate-slide-up text-sm font-medium">
          <Check className="w-5 h-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Tabs list */}
      <div className="flex border-b border-olive/15 overflow-x-auto gap-1">
        <button
          onClick={() => setActiveTab('homepage')}
          className={`px-5 py-3 text-sm font-bold tracking-wider transition-all border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'homepage' 
              ? 'border-olive text-olive font-black bg-olive/5 rounded-t-xl' 
              : 'border-transparent text-stone-500 hover:text-olive hover:bg-olive/5 hover:rounded-t-xl'
          }`}
        >
          Trang chủ
        </button>
        <button
          onClick={() => setActiveTab('slideshow')}
          className={`px-5 py-3 text-sm font-bold tracking-wider transition-all border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'slideshow' 
              ? 'border-olive text-olive font-black bg-olive/5 rounded-t-xl' 
              : 'border-transparent text-stone-500 hover:text-olive hover:bg-olive/5 hover:rounded-t-xl'
          }`}
        >
          Slideshow ảnh
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`px-5 py-3 text-sm font-bold tracking-wider transition-all border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'about' 
              ? 'border-olive text-olive font-black bg-olive/5 rounded-t-xl' 
              : 'border-transparent text-stone-500 hover:text-olive hover:bg-olive/5 hover:rounded-t-xl'
          }`}
        >
          Trang Về Harry
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-5 py-3 text-sm font-bold tracking-wider transition-all border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'timeline' 
              ? 'border-olive text-olive font-black bg-olive/5 rounded-t-xl' 
              : 'border-transparent text-stone-500 hover:text-olive hover:bg-olive/5 hover:rounded-t-xl'
          }`}
        >
          Chặng đường sự nghiệp
        </button>
      </div>

      {/* Content tabs */}
      <div className="bg-cream/65 border border-olive/15 rounded-3xl p-6 md:p-8 shadow-xs">
        
        {/* Tab 1: Homepage settings */}
        {activeTab === 'homepage' && (
          <form onSubmit={handleSaveHomepage} className="flex flex-col gap-6 max-w-4xl">
            <h2 className="font-serif text-lg font-bold text-stone-850 border-b border-olive/10 pb-2">Cấu hình Anh hùng (Hero Section)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Lời chào mừng đầu trang</label>
                <input
                  type="text"
                  required
                  value={welcomeText}
                  onChange={(e) => setWelcomeText(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-olive/10 bg-cream/30 focus:border-olive focus:bg-cream transition-all text-sm outline-none text-stone-850"
                  placeholder="Ví dụ: 👋 Chào bạn ghé thăm góc của Harry"
                />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Tiêu đề chính lớn (Title)</label>
                <input
                  type="text"
                  required
                  value={homeTitle}
                  onChange={(e) => setHomeTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-olive/10 bg-cream/30 focus:border-olive focus:bg-cream transition-all text-sm outline-none text-stone-850 font-serif font-bold"
                  placeholder="Ví dụ: Chia sẻ Tư duy sản phẩm & Thương hiệu cá nhân."
                />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Đoạn mô tả phụ (Description)</label>
                <textarea
                  rows={3}
                  required
                  value={homeDesc}
                  onChange={(e) => setHomeDesc(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-olive/10 bg-cream/30 focus:border-olive focus:bg-cream transition-all text-sm outline-none text-stone-850 resize-none font-sans"
                  placeholder="Giới thiệu đôi nét về bản thân của bạn..."
                />
              </div>

              {/* Slideshow image manager integrated right inside the Hero section */}
              <div className="flex flex-col gap-4 border-t border-olive/10 pt-6 md:col-span-2 text-left">
                <div className="flex justify-between items-center pb-2">
                  <h3 className="font-serif text-md font-bold text-stone-850">Hình ảnh Hero Slideshow</h3>
                  <span className="text-[10px] text-stone-400 font-medium font-sans">Ảnh tự động chuyển đổi sau mỗi 5 giây</span>
                </div>
                
                <div className="bg-cream/40 border border-olive/10 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-end">
                  <div className="flex flex-col gap-1.5 flex-1 w-full">
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Đường dẫn ảnh mới (URL)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newSlideUrl}
                        onChange={(e) => setNewSlideUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/... hoặc chọn từ thư viện ảnh"
                        className="flex-1 px-4 py-2.5 rounded-xl border border-olive/10 bg-cream/30 focus:border-olive focus:bg-cream transition-all text-xs outline-none text-stone-850 font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleOpenMediaForNewSlide}
                        className="px-3 bg-sand/35 border border-olive/10 text-stone-600 hover:bg-sand/60 rounded-xl transition-all flex items-center justify-center cursor-pointer"
                        title="Chọn ảnh từ Thư viện Media"
                      >
                        <ImageIcon className="w-4 h-4 text-olive" />
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddSlide()}
                    className="bg-olive text-cream hover:bg-olive-dark font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer h-[42px] shrink-0"
                  >
                    <Plus className="w-4 h-4" /> Thêm ảnh
                  </button>
                </div>

                {slides.length === 0 ? (
                  <div className="py-8 border border-dashed border-olive/10 rounded-2xl text-center bg-cream/30 text-stone-500 flex flex-col items-center gap-1.5">
                    <ImageIcon className="w-6 h-6 text-stone-300" />
                    <p className="text-xs font-semibold">Chưa có ảnh nào trong slideshow.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
                    {slides.map((slide, idx) => (
                      <div 
                        key={slide.id} 
                        className="relative group border border-olive/10 rounded-2xl overflow-hidden bg-cream/40 flex flex-col shadow-xs"
                      >
                        <div className="relative aspect-square w-full bg-sand">
                          <Image 
                            src={slide.imageUrl} 
                            alt={`Slide preview ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="p-2 flex justify-between items-center bg-sand/20 border-t border-olive/5 text-[10px] text-stone-500">
                          <div className="flex items-center gap-1 font-mono">
                            <span>Thứ tự:</span>
                            <input
                              type="number"
                              value={slide.order}
                              onChange={(e) => handleUpdateSlideOrder(slide.id, Number(e.target.value))}
                              className="w-8 px-1 py-0.5 rounded border border-olive/10 bg-cream text-center font-bold outline-none"
                            />
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => handleDeleteSlide(slide.id)}
                            className="p-1 rounded text-stone-400 hover:text-red-650 hover:bg-red-50/10 transition-all cursor-pointer"
                            title="Xóa ảnh"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <h2 className="font-serif text-lg font-bold text-stone-850 border-b border-olive/10 pb-2 mt-4">3 Trụ cột Định hình Thương hiệu</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pillar 1 */}
              <div className="flex flex-col gap-3 p-4 rounded-2xl border border-olive/10 bg-cream/40">
                <span className="text-[10px] font-bold text-olive uppercase tracking-widest">Trụ cột 1 (Hành trình)</span>
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    required
                    value={pillar1Title}
                    onChange={(e) => setPillar1Title(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-olive/10 bg-cream/30 text-xs font-bold text-stone-800"
                    placeholder="Tiêu đề cột 1"
                  />
                  <textarea
                    rows={4}
                    required
                    value={pillar1Desc}
                    onChange={(e) => setPillar1Desc(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-olive/10 bg-cream/30 text-xs text-stone-600 resize-none"
                    placeholder="Mô tả cột 1"
                  />
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="flex flex-col gap-3 p-4 rounded-2xl border border-olive/10 bg-cream/40">
                <span className="text-[10px] font-bold text-olive uppercase tracking-widest">Trụ cột 2 (Chia sẻ)</span>
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    required
                    value={pillar2Title}
                    onChange={(e) => setPillar2Title(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-olive/10 bg-cream/30 text-xs font-bold text-stone-800"
                    placeholder="Tiêu đề cột 2"
                  />
                  <textarea
                    rows={4}
                    required
                    value={pillar2Desc}
                    onChange={(e) => setPillar2Desc(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-olive/10 bg-cream/30 text-xs text-stone-600 resize-none"
                    placeholder="Mô tả cột 2"
                  />
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="flex flex-col gap-3 p-4 rounded-2xl border border-olive/10 bg-cream/40">
                <span className="text-[10px] font-bold text-olive uppercase tracking-widest">Trụ cột 3 (Kinh doanh)</span>
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    required
                    value={pillar3Title}
                    onChange={(e) => setPillar3Title(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-olive/10 bg-cream/30 text-xs font-bold text-stone-800"
                    placeholder="Tiêu đề cột 3"
                  />
                  <textarea
                    rows={4}
                    required
                    value={pillar3Desc}
                    onChange={(e) => setPillar3Desc(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-olive/10 bg-cream/30 text-xs text-stone-600 resize-none"
                    placeholder="Mô tả cột 3"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-olive/10">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-olive text-cream hover:bg-olive-dark font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Đang cập nhật...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Lưu cấu hình trang chủ
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Slideshow Settings */}
        {activeTab === 'slideshow' && (
          <div className="flex flex-col gap-6 max-w-4xl">
            <div className="flex justify-between items-center border-b border-olive/10 pb-2">
              <h2 className="font-serif text-lg font-bold text-stone-850">Thư viện ảnh Slideshow Hero</h2>
              <span className="text-xs text-stone-400 font-medium">Lưu ý: Ảnh sẽ tự động chạy mỗi 5 giây ngoài trang chủ</span>
            </div>

            {/* Add Slide URL Form */}
            <form onSubmit={handleAddSlide} className="bg-cream/40 border border-olive/10 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-end">
              <div className="flex flex-col gap-1.5 flex-1 w-full">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Đường dẫn ảnh mới (URL)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newSlideUrl}
                    onChange={(e) => setNewSlideUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... hoặc chọn từ thư viện ảnh"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-olive/10 bg-cream/30 focus:border-olive focus:bg-cream transition-all text-xs outline-none text-stone-850 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleOpenMediaForNewSlide}
                    className="px-3 bg-sand/35 border border-olive/10 text-stone-600 hover:bg-sand/60 rounded-xl transition-all flex items-center justify-center cursor-pointer"
                    title="Chọn ảnh từ Thư viện Media"
                  >
                    <ImageIcon className="w-4 h-4 text-olive" />
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="bg-olive text-cream hover:bg-olive-dark font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer h-[42px] shrink-0"
              >
                <Plus className="w-4 h-4" /> Thêm ảnh
              </button>
            </form>

            {/* Displaying list of current slides */}
            {slides.length === 0 ? (
              <div className="py-12 border border-dashed border-olive/10 rounded-3xl text-center bg-cream/30 text-stone-500 flex flex-col items-center gap-2">
                <ImageIcon className="w-8 h-8 text-stone-300" />
                <p className="text-sm font-semibold">Chưa có ảnh nào trong slideshow.</p>
                <p className="text-xs text-stone-400">Hãy thêm link ảnh hoặc chọn từ thư viện để tạo chuyển động.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 pt-2">
                {slides.map((slide, idx) => (
                  <div 
                    key={slide.id} 
                    className="relative group border border-olive/10 rounded-2xl overflow-hidden bg-cream/40 flex flex-col shadow-xs"
                  >
                    {/* Thumbnail preview */}
                    <div className="relative aspect-square w-full bg-sand">
                      <Image 
                        src={slide.imageUrl} 
                        alt={`Slide preview ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Meta controls */}
                    <div className="p-3 flex justify-between items-center bg-sand/20 border-t border-olive/5 text-[11px] text-stone-500">
                      <div className="flex items-center gap-1 font-mono">
                        <span>Thứ tự:</span>
                        <input
                          type="number"
                          value={slide.order}
                          onChange={(e) => handleUpdateSlideOrder(slide.id, Number(e.target.value))}
                          className="w-10 px-1 py-0.5 rounded border border-olive/10 bg-cream text-center font-bold outline-none"
                        />
                      </div>
                      
                      <button
                        onClick={() => handleDeleteSlide(slide.id)}
                        className="p-1 rounded text-stone-400 hover:text-red-650 hover:bg-red-50/10 transition-all cursor-pointer"
                        title="Xóa ảnh"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: About Settings */}
        {activeTab === 'about' && (
          <form onSubmit={handleSaveAbout} className="flex flex-col gap-6 max-w-4xl">
            <h2 className="font-serif text-lg font-bold text-stone-850 border-b border-olive/10 pb-2">Nội dung tóm tắt Trang Về Harry</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Tiêu đề chính trang (Title)</label>
                <input
                  type="text"
                  required
                  value={aboutTitle}
                  onChange={(e) => setAboutTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-olive/10 bg-cream/30 focus:border-olive focus:bg-cream transition-all text-sm outline-none text-stone-850 font-serif font-bold"
                  placeholder="Ví dụ: Về Harry (Quang Hiếu)"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Tiêu đề phụ nổi bật (Subtitle badge)</label>
                <input
                  type="text"
                  required
                  value={aboutSubtitle}
                  onChange={(e) => setAboutSubtitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-olive/10 bg-cream/30 focus:border-olive focus:bg-cream transition-all text-sm outline-none text-stone-850"
                  placeholder="Ví dụ: 📖 Câu chuyện của mình"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Hình đại diện (Portrait Photo URL)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={aboutAvatarUrl}
                    onChange={(e) => setAboutAvatarUrl(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl border border-olive/10 bg-cream/30 focus:border-olive focus:bg-cream transition-all text-xs outline-none text-stone-800 font-mono"
                    placeholder="/harry_Portrait.png"
                  />
                  <button
                    type="button"
                    onClick={handleOpenMediaForAvatar}
                    className="px-3 bg-sand/35 border border-olive/10 text-stone-600 hover:bg-sand/60 rounded-xl transition-all flex items-center justify-center cursor-pointer"
                    title="Chọn ảnh từ Thư viện Media"
                  >
                    <ImageIcon className="w-4 h-4 text-olive" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Văn bản câu chuyện (Description)</label>
                <textarea
                  rows={6}
                  required
                  value={aboutDesc}
                  onChange={(e) => setAboutDesc(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-olive/10 bg-cream/30 focus:border-olive focus:bg-cream transition-all text-sm outline-none text-stone-850 font-sans leading-relaxed"
                  placeholder="Nhập toàn bộ câu chuyện giới thiệu tóm tắt của bạn tại đây (Hỗ trợ viết xuống dòng)..."
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-olive/10">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-olive text-cream hover:bg-olive-dark font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Đang cập nhật...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Lưu thông tin Về Harry
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Tab 4: Timeline Milestones CRUD */}
        {activeTab === 'timeline' && (
          <div className="flex flex-col gap-6 max-w-4xl">
            <div className="flex justify-between items-center border-b border-olive/10 pb-2">
              <h2 className="font-serif text-lg font-bold text-stone-850">Chặng đường tự học & phát triển</h2>
              <button
                onClick={() => handleOpenMilestoneModal(null)}
                className="flex items-center gap-1 px-4 py-2 rounded-xl border border-olive bg-olive text-cream hover:bg-olive-dark transition-all text-xs font-semibold cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm chặng đường mới
              </button>
            </div>

            {/* List timeline milestones */}
            {timeline.length === 0 ? (
              <div className="py-12 border border-dashed border-olive/10 rounded-3xl text-center bg-cream/30 text-stone-500 flex flex-col items-center gap-2">
                <Milestone className="w-8 h-8 text-stone-300" />
                <p className="text-sm font-semibold">Chưa có cột mốc chặng đường nào.</p>
                <p className="text-xs text-stone-400">Hãy nhấn "Thêm chặng đường mới" để bắt đầu ghi lại lịch sử tự học.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {timeline.map((step) => {
                  return (
                    <div 
                      key={step.id} 
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 rounded-2xl border border-olive/10 bg-cream/40 hover:border-olive/20 hover:bg-cream transition-all shadow-xs"
                    >
                      <div className="flex gap-4 items-center flex-1 max-w-xl">
                        <div className="w-10 h-10 rounded-xl bg-olive/10 border border-olive/5 flex items-center justify-center text-olive shrink-0">
                          {/* Dynamically resolve icon iconName indicator for list */}
                          <Milestone className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col gap-1 text-left">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[9px] font-bold text-olive uppercase tracking-widest bg-olive/5 px-2 py-0.5 rounded-md">
                              {step.period}
                            </span>
                            <span className="text-[10px] font-semibold text-stone-450">
                              {step.role}
                            </span>
                            <span className="text-[9px] font-mono text-stone-400">
                              Thứ tự: {step.order}
                            </span>
                          </div>
                          <h4 className="font-serif font-bold text-stone-850 text-sm">{step.title}</h4>
                          <p className="text-stone-500 text-xs font-sans line-clamp-1">{step.description}</p>
                        </div>
                      </div>

                      <div className="flex gap-1.5 self-end sm:self-center">
                        <button
                          onClick={() => handleOpenMilestoneModal(step)}
                          className="p-2 rounded-lg border border-olive/10 hover:border-olive/20 text-stone-500 hover:text-olive hover:bg-cream transition-all cursor-pointer"
                          title="Sửa chặng đường"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteMilestone(step.id)}
                          className="p-2 rounded-lg border border-red-100 hover:border-red-200 text-stone-500 hover:text-red-650 hover:bg-red-50/15 transition-all cursor-pointer"
                          title="Xóa chặng đường"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Media Selector Drawer */}
      <MediaDrawer 
        isOpen={isMediaDrawerOpen}
        onClose={() => {
          setIsMediaDrawerOpen(false);
          setMediaTarget(null);
        }}
        onSelectAsCover={handleMediaSelect}
        onInsertToContent={() => {}}
      />

      {/* Timeline Milestone Create/Edit Modal POPUP */}
      {isMilestoneModalOpen && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-cream border border-olive/15 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-up">
            {/* Modal Header */}
            <div className="bg-sand/30 px-6 py-4 border-b border-olive/10 flex justify-between items-center">
              <h3 className="font-serif font-black text-stone-850 text-md">
                {editingMilestone ? 'Sửa chặng đường' : 'Thêm chặng đường mới'}
              </h3>
              <button 
                onClick={() => setIsMilestoneModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveMilestoneSubmit} className="p-6 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                {/* Period */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-stone-500 uppercase tracking-widest">Kỳ hạn / Giai đoạn *</label>
                  <input
                    type="text"
                    required
                    value={mPeriod}
                    onChange={(e) => setMPeriod(e.target.value)}
                    placeholder="Ví dụ: Giai đoạn 1"
                    className="w-full px-3 py-2 rounded-lg border border-olive/10 bg-cream/30 text-xs text-stone-850 font-bold outline-none focus:border-olive"
                  />
                </div>

                {/* Order */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-stone-500 uppercase tracking-widest">Thứ tự hiển thị *</label>
                  <input
                    type="number"
                    required
                    value={mOrder}
                    onChange={(e) => setMOrder(Number(e.target.value))}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-lg border border-olive/10 bg-cream/30 text-xs text-stone-850 outline-none focus:border-olive font-mono"
                  />
                </div>
              </div>

              {/* Title */}
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-stone-500 uppercase tracking-widest">Tiêu đề chặng đường *</label>
                <input
                  type="text"
                  required
                  value={mTitle}
                  onChange={(e) => setMTitle(e.target.value)}
                  placeholder="Ví dụ: Lập trình viên tự do"
                  className="w-full px-3 py-2 rounded-lg border border-olive/10 bg-cream/30 text-xs text-stone-850 font-bold outline-none focus:border-olive"
                />
              </div>

              {/* Role */}
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-stone-500 uppercase tracking-widest">Vai trò / Định vị *</label>
                <input
                  type="text"
                  required
                  value={mRole}
                  onChange={(e) => setMRole(e.target.value)}
                  placeholder="Ví dụ: Làm chủ công nghệ & Tự học"
                  className="w-full px-3 py-2 rounded-lg border border-olive/10 bg-cream/30 text-xs text-stone-850 outline-none focus:border-olive"
                />
              </div>

              {/* Icon Name selection */}
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-stone-500 uppercase tracking-widest">Biểu tượng (Lucide Icon) *</label>
                <select
                  value={mIconName}
                  onChange={(e) => setMIconName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-olive/10 bg-cream/30 text-xs text-stone-850 outline-none focus:border-olive cursor-pointer"
                >
                  {PRESET_ICONS.map(icon => (
                    <option key={icon.name} value={icon.name}>{icon.label}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-stone-500 uppercase tracking-widest">Mô tả hoạt động / Thử thách *</label>
                <textarea
                  rows={4}
                  required
                  value={mDescription}
                  onChange={(e) => setMDescription(e.target.value)}
                  placeholder="Nhập chi tiết những gì bạn đã trải qua ở giai đoạn này..."
                  className="w-full px-3 py-2 rounded-lg border border-olive/10 bg-cream/30 text-xs text-stone-700 outline-none focus:border-olive resize-none font-sans leading-relaxed"
                />
              </div>

              {/* Lesson learned */}
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-stone-500 uppercase tracking-widest">Bài học rút ra (Lesson learned) *</label>
                <textarea
                  rows={2}
                  required
                  value={mLesson}
                  onChange={(e) => setMLesson(e.target.value)}
                  placeholder="Ví dụ: Bài học: Kỹ năng kỹ thuật giúp hiện thực hóa mọi ý tưởng..."
                  className="w-full px-3 py-2 rounded-lg border border-olive/10 bg-cream/30 text-xs text-stone-700 outline-none focus:border-olive resize-none font-serif italic"
                />
              </div>

              {/* Modal Actions Footer */}
              <div className="flex gap-3 justify-end pt-4 border-t border-olive/10 mt-2">
                <button
                  type="button"
                  onClick={() => setIsMilestoneModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-sand/30 rounded-xl transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-olive text-cream hover:bg-olive-dark text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Lưu chặng đường
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
