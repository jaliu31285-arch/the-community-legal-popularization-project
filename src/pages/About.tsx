import { useState, useEffect } from 'react';
import {
  Users,
  Heart,
  Target,
  Eye,
  UserCheck,
  Building,
  GraduationCap,
  Mail,
  MapPin,
} from 'lucide-react';
import PageBanner from '@/components/common/PageBanner';
import { api } from '@/services/api';

const defaultAdvisors = [
  { id: 1, name: '张明教授', title: '法学教授', department: '四川大学法学院', avatar: '👨‍🏫', description: '长期从事青少年法治教育研究，具有丰富的普法经验' },
  { id: 2, name: '李华律师', title: '执业律师', department: '四川XX律师事务所', avatar: '👩‍⚖️', description: '专注于未成年人保护法律事务，热心公益普法事业' },
];

const defaultPartners = [
  { id: 1, name: '四川大学法学院', type: '指导单位', description: '项目发起单位，提供专业指导' },
  { id: 2, name: 'XX街道办事处', type: '合作单位', description: '实践活动支持单位' },
  { id: 3, name: 'XX社区居委会', type: '实践基地', description: '活动开展场地提供' },
  { id: 4, name: 'XX小学', type: '合作学校', description: '青少年普法教育合作' },
];

export default function About() {
  const [teamMembers, setTeamMembers] = useState<any[]>([
    { id: 1, name: '王小明', role: '项目负责人', avatar: '👨‍🎓', description: '法学专业，负责整体统筹' },
    { id: 2, name: '李小红', role: '普法讲师', avatar: '👩‍🎓', description: '教育学专业，负责课程设计' },
    { id: 3, name: '张大力', role: '活动策划', avatar: '👨‍💼', description: '社会学专业，负责活动组织' },
    { id: 4, name: '刘美丽', role: '宣传推广', avatar: '👩‍💻', description: '新媒体专业，负责宣传工作' },
    { id: 5, name: '陈浩然', role: '资料整理', avatar: '🧑‍🎓', description: '法学专业，负责资料收集' },
    { id: 6, name: '赵文静', role: '摄影记录', avatar: '👩‍🎨', description: '传媒专业，负责影像记录' },
    { id: 7, name: '孙志强', role: '后勤保障', avatar: '🧑‍🔧', description: '行政管理专业，负责后勤工作' },
    { id: 8, name: '周婷婷', role: '志愿者协调', avatar: '👧', description: '社会工作专业，负责志愿者管理' },
  ]);
  const [advisors, setAdvisors] = useState<any[]>(defaultAdvisors);
  const [partners, setPartners] = useState<any[]>(defaultPartners);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamData, advisorsData, partnersData] = await Promise.all([
          api.getTeam(),
          api.getAdvisors(),
          api.getPartners(),
        ]);
        
        setTeamMembers(teamData.length > 0 ? teamData : [
          { id: 1, name: '王小明', role: '项目负责人', avatar: '👨‍🎓', description: '法学专业，负责整体统筹' },
          { id: 2, name: '李小红', role: '普法讲师', avatar: '👩‍🎓', description: '教育学专业，负责课程设计' },
          { id: 3, name: '张大力', role: '活动策划', avatar: '👨‍💼', description: '社会学专业，负责活动组织' },
          { id: 4, name: '刘美丽', role: '宣传推广', avatar: '👩‍💻', description: '新媒体专业，负责宣传工作' },
          { id: 5, name: '陈浩然', role: '资料整理', avatar: '🧑‍🎓', description: '法学专业，负责资料收集' },
          { id: 6, name: '赵文静', role: '摄影记录', avatar: '👩‍🎨', description: '传媒专业，负责影像记录' },
          { id: 7, name: '孙志强', role: '后勤保障', avatar: '🧑‍🔧', description: '行政管理专业，负责后勤工作' },
          { id: 8, name: '周婷婷', role: '志愿者协调', avatar: '👧', description: '社会工作专业，负责志愿者管理' },
        ]);
        
        setAdvisors(advisorsData.length > 0 ? advisorsData : defaultAdvisors);
        setPartners(partnersData.length > 0 ? partnersData : defaultPartners);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setTeamMembers([
          { id: 1, name: '王小明', role: '项目负责人', avatar: '👨‍🎓', description: '法学专业，负责整体统筹' },
          { id: 2, name: '李小红', role: '普法讲师', avatar: '👩‍🎓', description: '教育学专业，负责课程设计' },
          { id: 3, name: '张大力', role: '活动策划', avatar: '👨‍💼', description: '社会学专业，负责活动组织' },
          { id: 4, name: '刘美丽', role: '宣传推广', avatar: '👩‍💻', description: '新媒体专业，负责宣传工作' },
          { id: 5, name: '陈浩然', role: '资料整理', avatar: '🧑‍🎓', description: '法学专业，负责资料收集' },
          { id: 6, name: '赵文静', role: '摄影记录', avatar: '👩‍🎨', description: '传媒专业，负责影像记录' },
          { id: 7, name: '孙志强', role: '后勤保障', avatar: '🧑‍🔧', description: '行政管理专业，负责后勤工作' },
          { id: 8, name: '周婷婷', role: '志愿者协调', avatar: '👧', description: '社会工作专业，负责志愿者管理' },
        ]);
        setAdvisors(defaultAdvisors);
        setPartners(defaultPartners);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      <PageBanner
        title="关于我们"
        subtitle="法暖万家·守护朝夕"
        gradient="from-indigo-600 via-blue-600 to-cyan-500"
        icon={<Users className="w-10 h-10 text-white" />}
      />

      {/* Project Intro */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block text-primary-600 font-medium mb-3">项目背景</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-6">
                关于"法润青苗"项目
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="bg-gradient-to-br from-primary-50 to-white rounded-3xl p-8 border border-primary-100">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-blue-600 text-white flex items-center justify-center mb-6">
                  <Target className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">项目初衷</h3>
                <p className="text-slate-600 leading-relaxed">
                  随着互联网的普及，未成年人面临的网络安全问题日益突出。
                  网络暴力、网络诈骗、不良消费诱导等问题严重影响青少年的身心健康。
                  我们希望通过普法宣传，帮助未成年人树立正确的网络安全意识，
                  学会用法律武器保护自己。
                </p>
              </div>

              <div className="bg-gradient-to-br from-growth-50 to-white rounded-3xl p-8 border border-growth-100">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-growth-500 to-teal-600 text-white flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">项目愿景</h3>
                <p className="text-slate-600 leading-relaxed">
                  打造一个可持续、可复用的未成年人网络安全普法公益平台，
                  让更多青少年受益。以高校之力，担社会之责，
                  用法律的阳光守护每一株幼苗的健康成长，
                  让网络空间真正成为青少年成长的沃土。
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-3xl p-8 lg:p-12">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">
                项目意义
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: '普法教育', desc: '向未成年人普及网络安全法律知识，提高法治意识' },
                  { title: '实践育人', desc: '让大学生在社会实践中增长才干，服务社会' },
                  { title: '长效影响', desc: '打造可复用的公益平台，持续发挥价值' },
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <span className="text-2xl font-bold text-primary-600">{index + 1}</span>
                    </div>
                    <h4 className="font-bold text-slate-800 mb-2">{item.title}</h4>
                    <p className="text-sm text-slate-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block text-warm-600 font-medium mb-3">团队介绍</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              法暖万家·守护朝夕团队
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              一群有理想、有担当的大学生，用专业知识和满腔热忱，
              为未成年人网络保护贡献青春力量
            </p>
          </div>

          {/* Advisors */}
          <div className="max-w-4xl mx-auto mb-16">
            <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">
              指导老师
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {advisors.map((advisor) => (
                <div
                  key={advisor.id}
                  className="bg-white rounded-2xl p-6 flex items-center gap-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                >
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-warm-400 to-orange-500 flex items-center justify-center text-4xl flex-shrink-0">
                    {advisor.avatar}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-800">{advisor.name}</h4>
                    <p className="text-warm-600 text-sm font-medium mb-1">{advisor.title}</p>
                    <p className="text-slate-500 text-sm mb-2">{advisor.department}</p>
                    <p className="text-sm text-slate-600">{advisor.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Members */}
          <div className="max-w-5xl mx-auto">
            <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">
              团队成员
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <div
                  key={member.id}
                  className="bg-white rounded-2xl p-6 text-center shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all group"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-400 to-blue-500 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    {member.avatar}
                  </div>
                  <h4 className="font-bold text-slate-800 mb-1">{member.name}</h4>
                  <p className="text-sm text-primary-600 font-medium mb-2">{member.role}</p>
                  <p className="text-xs text-slate-500">{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block text-growth-600 font-medium mb-3">合作单位</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              感谢支持
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              感谢以下单位对本次实践活动的大力支持与协助
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {partners.map((partner, index) => (
                <div
                  key={index}
                  className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100 hover:border-growth-300 hover:shadow-md transition-all group cursor-pointer"
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <Building className="w-6 h-6 text-slate-400 group-hover:text-growth-500 transition-colors" />
                  </div>
                  <h4 className="font-medium text-slate-700 text-sm mb-1">{partner.name}</h4>
                  <span className="text-xs text-slate-400">{partner.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="w-20 h-20 mx-auto mb-8 bg-white/20 rounded-3xl flex items-center justify-center">
              <Heart className="w-10 h-10" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              联系我们
            </h2>
            <p className="text-xl text-white/90 mb-10">
              如果您对我们的项目感兴趣，或希望开展合作，欢迎随时联系我们
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Mail className="w-8 h-8 mx-auto mb-3" />
                <p className="font-medium">电子邮箱</p>
                <p className="text-white/80 text-sm">farunqingmiao@example.com</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <MapPin className="w-8 h-8 mx-auto mb-3" />
                <p className="font-medium">项目地址</p>
                <p className="text-white/80 text-sm">四川省成都市四川大学</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
