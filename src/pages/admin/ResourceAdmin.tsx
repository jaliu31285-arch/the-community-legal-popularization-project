import GenericCrud from './GenericCrud';
import { api } from '@/services/api';

export default function ResourceAdmin() {
  return (
    <GenericCrud
      title="资源管理"
      description="管理学习资源和普法物料"
      listTitleKey="title"
      frontendPage="学习资源库"
      frontendLocation="资源列表中的每个资源卡片，包含封面、名称和下载按钮"
      fields={[
        { key: 'title', label: '资源名称', type: 'text', required: true, helpText: '资源的标题名称' },
        { key: 'category', label: '分类', type: 'select', helpText: '资源的分类，用于筛选和展示', options: [
          { label: '科普读物', value: '科普读物' },
          { label: '法律解读', value: '法律解读' },
          { label: '课件PPT', value: '课件PPT' },
          { label: '工具模板', value: '工具模板' },
          { label: '漫画绘本', value: '漫画绘本' },
        ]},
        { key: 'type', label: '文件类型', type: 'select', helpText: '资源的文件类型，决定显示的图标', options: [
          { label: 'PDF', value: 'pdf' },
          { label: 'PPT', value: 'ppt' },
          { label: 'Word', value: 'doc' },
          { label: '视频', value: 'video' },
          { label: '图片', value: 'image' },
          { label: '文章', value: 'article' },
        ]},
        { key: 'description', label: '资源简介', type: 'textarea', helpText: '资源的简要介绍' },
        { key: 'file_url', label: '文件地址', type: 'file', helpText: '资源文件，支持上传本地文件或填写外部链接。文件地址优先级高于外部链接，两者都填时优先使用文件地址', formatHint: 'https://... 或 /uploads/xxx.pdf' },
        { key: 'image_url', label: '封面图片', type: 'image', helpText: '资源封面图，推荐比例 3:4，无图则显示渐变背景', formatHint: 'https://... 或 /uploads/xxx.jpg' },
        { key: 'link_url', label: '外部链接', type: 'text', helpText: '外部链接地址，如在线文档、视频播放页等。没有上传文件时，点击卡片会跳转到此链接' },
        { key: 'file_size', label: '文件大小', type: 'text', placeholder: '如 2.5 MB', helpText: '文件大小信息，显示在资源卡片上' },
        { key: 'cover_color', label: '封面渐变色', type: 'text', placeholder: 'from-blue-500 to-blue-600', helpText: '无封面图片时的渐变背景色' },
      ]}
      fetchAll={() => api.getResources(true)}
      create={(data) => api.createResource(data)}
      update={(id, data) => api.updateResource(id, data)}
      remove={(id) => api.deleteResource(id)}
    />
  );
}
