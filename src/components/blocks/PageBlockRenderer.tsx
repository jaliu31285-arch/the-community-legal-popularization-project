import {
  Landmark,
  Users,
  Theater,
  Award,
  BookOpen,
  MapPin,
  Image,
  Shield,
  Scale,
  FileText,
  Gift,
  Gamepad2,
  MessageSquare,
  Wallet,
  AlertTriangle,
  AlertCircle,
  UserCheck,
  Cpu,
  Sun,
  Phone,
  Flag,
  ChevronRight,
  Play,
} from 'lucide-react';

const iconMap: Record<string, any> = {
  Landmark,
  Users,
  Theater,
  Award,
  BookOpen,
  MapPin,
  Image,
  Shield,
  Scale,
  FileText,
  Gift,
  Gamepad2,
  MessageSquare,
  Wallet,
  AlertTriangle,
  AlertCircle,
  UserCheck,
  Cpu,
  Sun,
  Phone,
  Flag,
};

const colorMap: Record<string, string> = {
  blue: 'bg-blue-500',
  green: 'bg-emerald-500',
  orange: 'bg-orange-500',
  red: 'bg-red-500',
  purple: 'bg-purple-500',
  pink: 'bg-pink-500',
  cyan: 'bg-cyan-500',
  amber: 'bg-amber-500',
};

const textColorMap: Record<string, string> = {
  blue: 'text-blue-600',
  green: 'text-emerald-600',
  orange: 'text-orange-600',
  red: 'text-red-600',
  purple: 'text-purple-600',
  pink: 'text-pink-600',
  cyan: 'text-cyan-600',
  amber: 'text-amber-600',
};

const bgLightMap: Record<string, string> = {
  blue: 'bg-blue-50',
  green: 'bg-emerald-50',
  orange: 'bg-orange-50',
  red: 'bg-red-50',
  purple: 'bg-purple-50',
  pink: 'bg-pink-50',
  cyan: 'bg-cyan-50',
  amber: 'bg-amber-50',
};

interface BlockItem {
  icon?: string;
  title?: string;
  subtitle?: string;
  desc?: string;
  description?: string;
  image?: string;
  image_url?: string;
  label?: string;
  value?: string;
  color?: string;
  link?: string;
  link_url?: string;
}

interface PageBlock {
  id: number;
  page_name: string;
  block_type: string;
  title?: string;
  subtitle?: string;
  content?: string;
  image_url?: string;
  video_url?: string;
  items?: BlockItem[];
  background_color?: string;
  text_color?: string;
  layout?: string;
  sort_order: number;
  is_active: number;
}

function getIcon(iconName?: string) {
  if (!iconName) return null;
  const Icon = iconMap[iconName];
  return Icon ? <Icon className="w-6 h-6" /> : null;
}

function HeroBlock({ block }: { block: PageBlock }) {
  const hasGradient = block.background_color?.includes('from-');
  const isVideo = !!block.video_url;

  return (
    <section
      className={`relative min-h-[70vh] flex items-center justify-center overflow-hidden ${
        hasGradient ? `bg-gradient-to-br ${block.background_color}` : block.background_color || 'bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400'
      }`}
    >
      {block.image_url && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${block.image_url})` }}
        />
      )}
      {isVideo && (
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          autoPlay
          muted
          loop
          playsInline
          src={block.video_url}
        />
      )}
      <div className="relative z-10 text-center px-6 py-20 max-w-5xl mx-auto">
        {block.title && (
          <h1
            className={`text-4xl md:text-6xl font-bold mb-6 ${block.text_color === 'white' ? 'text-white' : 'text-slate-900'}`}
          >
            {block.title}
          </h1>
        )}
        {block.subtitle && (
          <p
            className={`text-xl md:text-2xl mb-4 ${block.text_color === 'white' ? 'text-white/90' : 'text-slate-600'}`}
          >
            {block.subtitle}
          </p>
        )}
        {block.content && (
          <p
            className={`text-base md:text-lg max-w-3xl mx-auto ${block.text_color === 'white' ? 'text-white/80' : 'text-slate-500'}`}
          >
            {block.content}
          </p>
        )}
      </div>
    </section>
  );
}

function TextBlock({ block }: { block: PageBlock }) {
  return (
    <section className={`py-16 ${block.background_color || ''}`}>
      <div className="max-w-4xl mx-auto px-6">
        {block.title && (
          <h2 className={`text-3xl font-bold mb-4 ${block.text_color || 'text-slate-900'}`}>
            {block.title}
          </h2>
        )}
        {block.subtitle && (
          <p className={`text-lg mb-6 ${block.text_color ? block.text_color : 'text-slate-600'}`}>
            {block.subtitle}
          </p>
        )}
        {block.content && (
          <div
            className={`prose max-w-none ${block.text_color || 'text-slate-700'}`}
            dangerouslySetInnerHTML={{ __html: block.content.replace(/\n/g, '<br/>') }}
          />
        )}
      </div>
    </section>
  );
}

function ImageTextBlock({ block }: { block: PageBlock }) {
  const layout = block.layout;
  const isRight = layout === 'right';

  return (
    <section className={`py-20 ${block.background_color || ''}`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className={`grid md:grid-cols-2 gap-12 items-center ${isRight ? 'md:grid-flow-dense' : ''}`}>
          <div className={isRight ? 'md:col-start-2' : ''}>
            {block.image_url ? (
              <img
                src={block.image_url}
                alt={block.title || ''}
                className="w-full h-80 object-cover rounded-2xl shadow-xl"
              />
            ) : block.video_url ? (
              <div className="relative rounded-2xl overflow-hidden shadow-xl bg-slate-900 aspect-video">
                <video
                  src={block.video_url}
                  controls
                  className="w-full h-full object-contain"
                  poster={block.image_url}
                />
              </div>
            ) : (
              <div className="w-full h-80 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center">
                <Image className="w-16 h-16 text-white/50" />
              </div>
            )}
          </div>
          <div className={isRight ? 'md:col-start-1' : ''}>
            {block.title && (
              <h2 className={`text-3xl font-bold mb-4 ${block.text_color || 'text-slate-900'}`}>
                {block.title}
              </h2>
            )}
            {block.subtitle && (
              <p className={`text-lg mb-4 ${block.text_color ? block.text_color : 'text-blue-600'} font-medium`}>
                {block.subtitle}
              </p>
            )}
            {block.content && (
              <p className={`text-base leading-relaxed ${block.text_color || 'text-slate-600'}`}>
                {block.content}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function VideoBlock({ block }: { block: PageBlock }) {
  return (
    <section className={`py-20 ${block.background_color || 'bg-slate-900'}`}>
      <div className="max-w-5xl mx-auto px-6">
        {(block.title || block.subtitle) && (
          <div className="text-center mb-12">
            {block.title && (
              <h2 className={`text-3xl font-bold mb-3 ${block.text_color || 'text-white'}`}>
                {block.title}
              </h2>
            )}
            {block.subtitle && (
              <p className={`text-lg ${block.text_color || 'text-slate-400'}`}>
                {block.subtitle}
              </p>
            )}
          </div>
        )}
        {block.video_url ? (
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-slate-800 aspect-video">
            <video
              src={block.video_url}
              controls
              className="w-full h-full object-contain"
              poster={block.image_url}
            />
          </div>
        ) : (
          <div className="aspect-video bg-slate-800 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-700">
            <Play className={`w-16 h-16 mb-3 ${block.text_color || 'text-slate-500'}`} />
            <p className={block.text_color || 'text-slate-500'}>视频暂未上传</p>
          </div>
        )}
        {block.content && (
          <p className={`text-center mt-6 ${block.text_color || 'text-slate-400'}`}>
            {block.content}
          </p>
        )}
      </div>
    </section>
  );
}

function CardsBlock({ block }: { block: PageBlock }) {
  const items = block.items || [];
  const cols = items.length <= 3 ? `md:grid-cols-${items.length}` : 'md:grid-cols-2 lg:grid-cols-4';

  return (
    <section className={`py-20 ${block.background_color || ''}`}>
      <div className="max-w-6xl mx-auto px-6">
        {(block.title || block.subtitle) && (
          <div className="text-center mb-16">
            {block.title && (
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${block.text_color || 'text-slate-900'}`}>
                {block.title}
              </h2>
            )}
            {block.subtitle && (
              <p className={`text-lg ${block.text_color ? block.text_color : 'text-slate-600'}`}>
                {block.subtitle}
              </p>
            )}
          </div>
        )}
        <div className={`grid gap-6 ${cols} grid-cols-1 sm:grid-cols-2`}>
          {items.map((item, index) => {
            const color = item.color || 'blue';
            const bgLight = bgLightMap[color] || 'bg-blue-50';
            const textColor = textColorMap[color] || 'text-blue-600';
            const bgColor = colorMap[color] || 'bg-blue-500';

            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 ${bgColor} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                  {getIcon(item.icon)}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {item.title || `卡片 ${index + 1}`}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {item.desc || item.description || ''}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function GalleryBlock({ block }: { block: PageBlock }) {
  const items = block.items || [];

  return (
    <section className={`py-20 ${block.background_color || ''}`}>
      <div className="max-w-6xl mx-auto px-6">
        {(block.title || block.subtitle) && (
          <div className="text-center mb-16">
            {block.title && (
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${block.text_color || 'text-slate-900'}`}>
                {block.title}
              </h2>
            )}
            {block.subtitle && (
              <p className={`text-lg ${block.text_color ? block.text_color : 'text-slate-600'}`}>
                {block.subtitle}
              </p>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <div
              key={index}
              className="group relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-square overflow-hidden">
                {item.image || item.image_url ? (
                  <img
                    src={item.image || item.image_url}
                    alt={item.title || ''}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                    <Image className="w-12 h-12 text-slate-400" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h4 className={`font-bold ${block.text_color || 'text-slate-900'}`}>
                  {item.title || `作品 ${index + 1}`}
                </h4>
                {(item.subtitle || item.desc) && (
                  <p className="text-sm text-slate-500 mt-1">
                    {item.subtitle || item.desc}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsBlock({ block }: { block: PageBlock }) {
  const items = block.items || [];

  return (
    <section className={`py-20 ${block.background_color || 'bg-gradient-to-r from-blue-600 to-cyan-500'}`}>
      <div className="max-w-6xl mx-auto px-6">
        {(block.title || block.subtitle) && (
          <div className="text-center mb-16">
            {block.title && (
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${block.text_color || 'text-white'}`}>
                {block.title}
              </h2>
            )}
            {block.subtitle && (
              <p className={`text-lg ${block.text_color || 'text-white/80'}`}>
                {block.subtitle}
              </p>
            )}
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {items.map((item, index) => (
            <div key={index} className="text-center">
              <div className={`text-4xl md:text-5xl font-bold mb-2 ${block.text_color || 'text-white'}`}>
                {item.value || '0'}
              </div>
              <div className={`text-base ${block.text_color || 'text-white/80'}`}>
                {item.label || `指标 ${index + 1}`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DividerBlock({ block }: { block: PageBlock }) {
  return (
    <section className={`py-8 ${block.background_color || ''}`}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="border-t border-slate-200" />
      </div>
    </section>
  );
}

export default function PageBlockRenderer({ block }: { block: PageBlock }) {
  switch (block.block_type) {
    case 'hero':
      return <HeroBlock block={block} />;
    case 'text':
      return <TextBlock block={block} />;
    case 'image_text':
    case 'imagetext':
      return <ImageTextBlock block={block} />;
    case 'video':
      return <VideoBlock block={block} />;
    case 'cards':
    case 'card':
      return <CardsBlock block={block} />;
    case 'gallery':
    case 'images':
      return <GalleryBlock block={block} />;
    case 'stats':
      return <StatsBlock block={block} />;
    case 'divider':
      return <DividerBlock block={block} />;
    default:
      return <TextBlock block={block} />;
  }
}
