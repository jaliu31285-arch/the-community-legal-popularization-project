interface PageBannerProps {
  title: string;
  subtitle: string;
  gradient: string;
  icon?: React.ReactNode;
}

export default function PageBanner({ title, subtitle, gradient, icon }: PageBannerProps) {
  return (
    <div className={`relative pt-24 pb-20 lg:pt-32 lg:pb-28 bg-gradient-to-br ${gradient} overflow-hidden`}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          {icon && (
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 animate-float">
              {icon}
            </div>
          )}
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 animate-fade-in-up">
            {title}
          </h1>
          <p className="text-xl text-white/90 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {subtitle}
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </div>
  );
}
