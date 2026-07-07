const API_BASE_URL = '/api';

interface RequestOptions extends RequestInit {
  requireAuth?: boolean;
}

export async function request<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { requireAuth = false, headers, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (headers) {
    if (headers instanceof Headers) {
      headers.forEach((value, key) => {
        finalHeaders[key] = value;
      });
    } else if (Array.isArray(headers)) {
      headers.forEach(([key, value]) => {
        finalHeaders[key] = value;
      });
    } else {
      Object.assign(finalHeaders, headers);
    }
  }

  if (requireAuth) {
    const token = localStorage.getItem('admin_token');
    if (token) {
      finalHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...rest,
    headers: finalHeaders,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || '请求失败');
  }

  return data;
}

export async function uploadFile(file: File, type: 'image' | 'resource' = 'image') {
  const formData = new FormData();
  formData.append('file', file);

  const token = localStorage.getItem('admin_token');
  const response = await fetch(`${API_BASE_URL}/upload/${type}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || '上传失败');
  }

  return data;
}

export const api = {
  // 认证
  login: (username: string, password: string) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  
  getMe: () =>
    request('/auth/me', { requireAuth: true }),
  
  changePassword: (oldPassword: string, newPassword: string) =>
    request('/auth/password', {
      method: 'PUT',
      requireAuth: true,
      body: JSON.stringify({ oldPassword, newPassword }),
    }),

  // 轮播图
  getBanners: (all = false) =>
    request(`/banners${all ? '?all=true' : ''}`),
  
  createBanner: (data: any) =>
    request('/banners', {
      method: 'POST',
      requireAuth: true,
      body: JSON.stringify(data),
    }),
  
  updateBanner: (id: number, data: any) =>
    request(`/banners/${id}`, {
      method: 'PUT',
      requireAuth: true,
      body: JSON.stringify(data),
    }),
  
  deleteBanner: (id: number) =>
    request(`/banners/${id}`, {
      method: 'DELETE',
      requireAuth: true,
    }),

  // 新闻
  getNews: (all = false) =>
    request(`/news${all ? '?all=true' : ''}`),
  
  getNewsById: (id: number) =>
    request(`/news/${id}`),
  
  createNews: (data: any) =>
    request('/news', {
      method: 'POST',
      requireAuth: true,
      body: JSON.stringify(data),
    }),
  
  updateNews: (id: number, data: any) =>
    request(`/news/${id}`, {
      method: 'PUT',
      requireAuth: true,
      body: JSON.stringify(data),
    }),
  
  deleteNews: (id: number) =>
    request(`/news/${id}`, {
      method: 'DELETE',
      requireAuth: true,
    }),

  // 活动
  getActivities: (all = false) =>
    request(`/activities${all ? '?all=true' : ''}`),
  
  createActivity: (data: any) =>
    request('/activities', {
      method: 'POST',
      requireAuth: true,
      body: JSON.stringify(data),
    }),
  
  updateActivity: (id: number, data: any) =>
    request(`/activities/${id}`, {
      method: 'PUT',
      requireAuth: true,
      body: JSON.stringify(data),
    }),
  
  deleteActivity: (id: number) =>
    request(`/activities/${id}`, {
      method: 'DELETE',
      requireAuth: true,
    }),

  // 资源
  getResources: (all = false) =>
    request(`/resources${all ? '?all=true' : ''}`),
  
  createResource: (data: any) =>
    request('/resources', {
      method: 'POST',
      requireAuth: true,
      body: JSON.stringify(data),
    }),
  
  updateResource: (id: number, data: any) =>
    request(`/resources/${id}`, {
      method: 'PUT',
      requireAuth: true,
      body: JSON.stringify(data),
    }),
  
  deleteResource: (id: number) =>
    request(`/resources/${id}`, {
      method: 'DELETE',
      requireAuth: true,
    }),

  // 团队
  getTeam: (all = false) =>
    request(`/team${all ? '?all=true' : ''}`),
  
  createTeamMember: (data: any) =>
    request('/team', {
      method: 'POST',
      requireAuth: true,
      body: JSON.stringify(data),
    }),
  
  updateTeamMember: (id: number, data: any) =>
    request(`/team/${id}`, {
      method: 'PUT',
      requireAuth: true,
      body: JSON.stringify(data),
    }),
  
  deleteTeamMember: (id: number) =>
    request(`/team/${id}`, {
      method: 'DELETE',
      requireAuth: true,
    }),

  // 成果
  getAchievements: (all = false) =>
    request(`/achievements${all ? '?all=true' : ''}`),
  
  createAchievement: (data: any) =>
    request('/achievements', {
      method: 'POST',
      requireAuth: true,
      body: JSON.stringify(data),
    }),
  
  updateAchievement: (id: number, data: any) =>
    request(`/achievements/${id}`, {
      method: 'PUT',
      requireAuth: true,
      body: JSON.stringify(data),
    }),
  
  deleteAchievement: (id: number) =>
    request(`/achievements/${id}`, {
      method: 'DELETE',
      requireAuth: true,
    }),

  // 统计
  getDashboardStats: () =>
    request('/stats/dashboard', { requireAuth: true }),
  
  // 普法专题
  getTopics: (category?: string) =>
    request(`/topics${category ? `?category=${category}` : ''}`),
  
  getAllTopics: () =>
    request('/topics?all=true'),
  
  createTopic: (data: any) =>
    request('/topics', {
      method: 'POST',
      requireAuth: true,
      body: JSON.stringify(data),
    }),
  
  updateTopic: (id: number, data: any) =>
    request(`/topics/${id}`, {
      method: 'PUT',
      requireAuth: true,
      body: JSON.stringify(data),
    }),
  
  deleteTopic: (id: number) =>
    request(`/topics/${id}`, {
      method: 'DELETE',
      requireAuth: true,
    }),

  // 指导老师
  getAdvisors: () =>
    request('/advisors'),
  
  getAllAdvisors: () =>
    request('/advisors?all=true'),
  
  createAdvisor: (data: any) =>
    request('/advisors', {
      method: 'POST',
      requireAuth: true,
      body: JSON.stringify(data),
    }),
  
  updateAdvisor: (id: number, data: any) =>
    request(`/advisors/${id}`, {
      method: 'PUT',
      requireAuth: true,
      body: JSON.stringify(data),
    }),
  
  deleteAdvisor: (id: number) =>
    request(`/advisors/${id}`, {
      method: 'DELETE',
      requireAuth: true,
    }),

  // 合作单位
  getPartners: () =>
    request('/partners'),
  
  getAllPartners: () =>
    request('/partners?all=true'),
  
  createPartner: (data: any) =>
    request('/partners', {
      method: 'POST',
      requireAuth: true,
      body: JSON.stringify(data),
    }),
  
  updatePartner: (id: number, data: any) =>
    request(`/partners/${id}`, {
      method: 'PUT',
      requireAuth: true,
      body: JSON.stringify(data),
    }),
  
  deletePartner: (id: number) =>
    request(`/partners/${id}`, {
      method: 'DELETE',
      requireAuth: true,
    }),

  // 首页统计数据
  getHomeStats: () =>
    request('/stats/home'),
  
  getAllStats: () =>
    request('/stats/home?all=true'),
  
  createStat: (data: any) =>
    request('/stats', {
      method: 'POST',
      requireAuth: true,
      body: JSON.stringify(data),
    }),
  
  updateStat: (id: number, data: any) =>
    request(`/stats/${id}`, {
      method: 'PUT',
      requireAuth: true,
      body: JSON.stringify(data),
    }),
  
  deleteStat: (id: number) =>
    request(`/stats/${id}`, {
      method: 'DELETE',
      requireAuth: true,
    }),

  // 站点设置
  getSiteSettings: () =>
    request('/settings'),
  
  getAllSettings: () =>
    request('/settings/all', { requireAuth: true }),
  
  saveSettings: (settings: Record<string, any>) =>
    request('/settings', {
      method: 'PUT',
      requireAuth: true,
      body: JSON.stringify(settings),
    }),

  // 导航菜单
  getNav: () =>
    request('/nav'),
  
  getAllNav: () =>
    request('/nav/all', { requireAuth: true }),
  
  createNavItem: (data: any) =>
    request('/nav', {
      method: 'POST',
      requireAuth: true,
      body: JSON.stringify(data),
    }),
  
  updateNavItem: (id: number, data: any) =>
    request(`/nav/${id}`, {
      method: 'PUT',
      requireAuth: true,
      body: JSON.stringify(data),
    }),
  
  deleteNavItem: (id: number) =>
    request(`/nav/${id}`, {
      method: 'DELETE',
      requireAuth: true,
    }),

  // 公告
  getAnnouncements: (limit?: number) =>
    request(`/announcements${limit ? `?limit=${limit}` : ''}`),
  
  getAnnouncementById: (id: number) =>
    request(`/announcements/${id}`),
  
  getAllAnnouncements: () =>
    request('/announcements?all=true', { requireAuth: true }),
  
  createAnnouncement: (data: any) =>
    request('/announcements', {
      method: 'POST',
      requireAuth: true,
      body: JSON.stringify(data),
    }),
  
  updateAnnouncement: (id: number, data: any) =>
    request(`/announcements/${id}`, {
      method: 'PUT',
      requireAuth: true,
      body: JSON.stringify(data),
    }),
  
  deleteAnnouncement: (id: number) =>
    request(`/announcements/${id}`, {
      method: 'DELETE',
      requireAuth: true,
    }),

  // 快速链接
  getQuickLinks: () =>
    request('/quick-links'),
  
  getAllQuickLinks: () =>
    request('/quick-links/all', { requireAuth: true }),
  
  createQuickLink: (data: any) =>
    request('/quick-links', {
      method: 'POST',
      requireAuth: true,
      body: JSON.stringify(data),
    }),
  
  updateQuickLink: (id: number, data: any) =>
    request(`/quick-links/${id}`, {
      method: 'PUT',
      requireAuth: true,
      body: JSON.stringify(data),
    }),
  
  deleteQuickLink: (id: number) =>
    request(`/quick-links/${id}`, {
      method: 'DELETE',
      requireAuth: true,
    }),

  // 页脚区块
  getFooterSections: () =>
    request('/footer-sections'),
  
  getAllFooterSections: () =>
    request('/footer-sections/all', { requireAuth: true }),
  
  createFooterSection: (data: any) =>
    request('/footer-sections', {
      method: 'POST',
      requireAuth: true,
      body: JSON.stringify(data),
    }),
  
  updateFooterSection: (id: number, data: any) =>
    request(`/footer-sections/${id}`, {
      method: 'PUT',
      requireAuth: true,
      body: JSON.stringify(data),
    }),
  
  deleteFooterSection: (id: number) =>
    request(`/footer-sections/${id}`, {
      method: 'DELETE',
      requireAuth: true,
    }),

  // 侧边栏组件
  getSidebarWidgets: () =>
    request('/sidebar-widgets'),
  
  getAllSidebarWidgets: () =>
    request('/sidebar-widgets/all', { requireAuth: true }),
  
  createSidebarWidget: (data: any) =>
    request('/sidebar-widgets', {
      method: 'POST',
      requireAuth: true,
      body: JSON.stringify(data),
    }),
  
  updateSidebarWidget: (id: number, data: any) =>
    request(`/sidebar-widgets/${id}`, {
      method: 'PUT',
      requireAuth: true,
      body: JSON.stringify(data),
    }),
  
  deleteSidebarWidget: (id: number) =>
    request(`/sidebar-widgets/${id}`, {
      method: 'DELETE',
      requireAuth: true,
    }),

  // 页面区块
  getPageSections: (page?: string) =>
    request(`/page-sections${page ? `?page=${page}` : ''}`),
  
  getAllPageSections: () =>
    request('/page-sections/all', { requireAuth: true }),
  
  createPageSection: (data: any) =>
    request('/page-sections', {
      method: 'POST',
      requireAuth: true,
      body: JSON.stringify(data),
    }),
  
  updatePageSection: (id: number, data: any) =>
    request(`/page-sections/${id}`, {
      method: 'PUT',
      requireAuth: true,
      body: JSON.stringify(data),
    }),
  
  deletePageSection: (id: number) =>
    request(`/page-sections/${id}`, {
      method: 'DELETE',
      requireAuth: true,
    }),
};
