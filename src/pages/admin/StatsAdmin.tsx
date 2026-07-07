import GenericCrud, { CrudField } from './GenericCrud';
import { api } from '@/services/api';

const fields: CrudField[] = [
  { key: 'label', label: '标签', type: 'text', required: true, listDisplay: true, helpText: '统计数据的名称，如"覆盖人数"、"活动场次"' },
  { key: 'value', label: '数值', type: 'text', required: true, listDisplay: true, helpText: '显示的数字，可带单位如 500+、12个、100%' },
  { key: 'icon', label: '图标', type: 'text', placeholder: '例如: Users, MapPin, BookOpen', helpText: 'Lucide图标库的图标名称，留空则使用默认图标' },
  { key: 'color', label: '颜色主题', type: 'text', placeholder: 'blue, green, orange, emerald, rose', helpText: '统计卡片的主题颜色，支持blue/green/orange/emerald/rose等' },
];

export default function StatsAdmin() {
  return (
    <GenericCrud
      title="统计数据管理"
      description="管理首页展示的统计数据"
      fields={fields}
      fetchAll={api.getAllStats}
      create={api.createStat}
      update={api.updateStat}
      remove={api.deleteStat}
      listTitleKey="label"
      frontendPage="首页右侧边栏"
      frontendLocation="数据统计展示区域，以数字卡片形式呈现"
    />
  );
}