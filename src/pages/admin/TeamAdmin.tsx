import GenericCrud from './GenericCrud';
import { api } from '@/services/api';

export default function TeamAdmin() {
  return (
    <GenericCrud
      title="团队成员管理"
      description="管理实践团队成员信息"
      listTitleKey="name"
      frontendPage="关于我们页"
      frontendLocation="团队成员展示区域，以头像卡片形式展示"
      fields={[
        { key: 'name', label: '姓名', type: 'text', required: true, helpText: '成员的真实姓名' },
        { key: 'role', label: '职位/分工', type: 'text', helpText: '成员在团队中的职位或负责的工作' },
        { key: 'avatar', label: '头像', type: 'text', placeholder: '上传图片URL或直接输入emoji表情如👨‍🎓', helpText: '成员头像，可使用图片URL或emoji表情。推荐正方形图片', formatHint: 'https://... 或 /uploads/xxx.jpg 或 emoji如👨‍🎓👩‍🎓' },
        { key: 'description', label: '个人简介', type: 'textarea', helpText: '成员的个人介绍，包括专业、特长等' },
      ]}
      fetchAll={() => api.getTeam(true)}
      create={(data) => api.createTeamMember(data)}
      update={(id, data) => api.updateTeamMember(id, data)}
      remove={(id) => api.deleteTeamMember(id)}
    />
  );
}
