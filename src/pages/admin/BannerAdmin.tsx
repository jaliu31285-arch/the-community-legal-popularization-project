import GenericCrud from './GenericCrud';
import { api } from '@/services/api';

export default function BannerAdmin() {
  return (
    <GenericCrud
      title="轮播图管理"
      description="管理首页轮播宣传海报"
      listTitleKey="title"
      frontendPage="首页"
      frontendLocation="页面顶部大Banner轮播区域"
      fields={[
        { key: 'title', label: '标题', type: 'text', required: true },
        { key: 'subtitle', label: '副标题', type: 'text' },
        { key: 'description', label: '描述', type: 'textarea' },
        { key: 'image_url', label: '背景图片', type: 'image', helpText: '推荐尺寸 1920x600，支持JPG/PNG/WebP格式', formatHint: 'https://... 或 /uploads/xxx.jpg' },
        { key: 'link_url', label: '跳转链接', type: 'text', helpText: '点击Banner跳转的链接，留空则不跳转' },
        { key: 'gradient', label: '渐变颜色', type: 'text', placeholder: 'from-blue-600 via-blue-500 to-cyan-400' },
      ]}
      fetchAll={() => api.getBanners(true)}
      create={(data) => api.createBanner(data)}
      update={(id, data) => api.updateBanner(id, data)}
      remove={(id) => api.deleteBanner(id)}
    />
  );
}
