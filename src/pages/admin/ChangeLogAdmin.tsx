import { useState, useEffect } from 'react';
import { History, Undo2, RefreshCw, Loader2, Clock, Edit2, Trash2, Filter } from 'lucide-react';
import { api } from '@/services/api';

const tableOptions = [
  { value: '', label: '全部' },
  { value: 'banners', label: '轮播图' },
  { value: 'news', label: '新闻动态' },
  { value: 'announcements', label: '公告管理' },
  { value: 'activities', label: '活动管理' },
  { value: 'resources', label: '资源管理' },
  { value: 'team_members', label: '团队成员' },
  { value: 'achievements', label: '项目成果' },
  { value: 'topics', label: '普法专题' },
  { value: 'nav_items', label: '导航菜单' },
  { value: 'quick_links', label: '快速链接' },
  { value: 'stats', label: '统计数据' },
  { value: 'partners', label: '合作单位' },
  { value: 'advisors', label: '指导老师' },
];

export default function ChangeLogAdmin() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState('');
  const [undoingId, setUndoingId] = useState<number | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await api.getChangeLogs(selectedTable || undefined, 100);
      setLogs(data);
    } catch (error: any) {
      console.error('获取操作日志失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [selectedTable]);

  const handleUndo = async (log: any) => {
    if (!window.confirm(`确定要撤回这次"${log.operation === 'update' ? '修改' : '删除'}"操作吗？\n\n操作对象：${log.table_label}\n记录ID：${log.record_id}\n时间：${log.created_at}`)) {
      return;
    }
    setUndoingId(log.id);
    try {
      await api.undoChange(log.id);
      alert('撤回成功！');
      fetchLogs();
    } catch (error: any) {
      alert(error.message || '撤回失败');
    } finally {
      setUndoingId(null);
    }
  };

  const getOperationIcon = (operation: string) => {
    switch (operation) {
      case 'update':
        return <Edit2 className="w-4 h-4" />;
      case 'delete':
        return <Trash2 className="w-4 h-4" />;
      default:
        return <History className="w-4 h-4" />;
    }
  };

  const getOperationLabel = (operation: string) => {
    switch (operation) {
      case 'update':
        return { text: '修改', color: 'bg-blue-100 text-blue-700' };
      case 'delete':
        return { text: '删除', color: 'bg-red-100 text-red-700' };
      case 'create':
        return { text: '新增', color: 'bg-green-100 text-green-700' };
      default:
        return { text: operation, color: 'bg-slate-100 text-slate-700' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">操作记录与撤回</h1>
          <p className="text-slate-500 mt-1">查看最近的操作记录，可一键撤回修改或删除操作</p>
        </div>
        <button
          onClick={fetchLogs}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          刷新
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-600">筛选：</span>
          </div>
          <select
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            {tableOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <History className="w-4 h-4" />
            共 {logs.length} 条记录
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <History className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>暂无操作记录</p>
            <p className="text-sm mt-2">修改或删除内容后，记录会显示在这里</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">操作类型</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">数据模块</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">记录ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">操作时间</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => {
                  const opLabel = getOperationLabel(log.operation);
                  return (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-500">#{log.id}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${opLabel.color}`}>
                          {getOperationIcon(log.operation)}
                          {opLabel.text}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-800">{log.table_label}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{log.record_id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Clock className="w-4 h-4" />
                          {log.created_at}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {(log.operation === 'update' || log.operation === 'delete') && (
                            <button
                              onClick={() => handleUndo(log)}
                              disabled={undoingId === log.id}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-amber-600 hover:bg-amber-50 rounded-lg transition-colors disabled:opacity-50"
                            >
                              {undoingId === log.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Undo2 className="w-4 h-4" />
                              )}
                              撤回
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
        <h3 className="font-medium text-amber-800 mb-2">使用说明</h3>
        <ul className="text-sm text-amber-700 space-y-1 list-disc list-inside">
          <li>系统会自动记录所有修改和删除操作，最多保留最近100条记录</li>
          <li>点击"撤回"可以将数据恢复到操作之前的状态</li>
          <li>删除操作的撤回会重新创建被删除的数据（ID可能会变化）</li>
          <li>新增操作暂不支持撤回，如需删除请手动删除</li>
          <li>建议操作前仔细确认，撤回后请前往对应页面验证数据是否正确</li>
        </ul>
      </div>
    </div>
  );
}
