
import React from 'react';
import { AgentConfig, AgentStatus, AgentAlert } from '../types';
import { AGENTS } from '../constants';
import { useTranslation } from '../context/LanguageContext';

interface AgentWidgetProps {
  agent: AgentConfig;
  status: AgentStatus;
  alertCount: number;
  onClick: () => void;
}

const AgentWidget: React.FC<AgentWidgetProps> = ({ agent, status, alertCount, onClick }) => {
  const { t, isRTL } = useTranslation();
  const isAttention = status === AgentStatus.ATTENTION;

  return (
    <button 
      onClick={onClick}
      className={`p-5 rounded-[2rem] border-2 transition-all duration-300 flex flex-col items-start gap-1 h-full w-full text-left active:scale-[0.98] ${
        isAttention 
          ? 'border-red-100 bg-red-50/30' 
          : 'border-slate-50 bg-white shadow-sm hover:shadow-md'
      }`}
    >
      <div className={`flex justify-between w-full items-center mb-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
          isAttention ? 'bg-red-100' : 'bg-slate-100'
        }`}>
          {agent.icon}
        </div>
        {alertCount > 0 && (
          <span className="bg-red-600 text-white text-[8px] font-black px-2 py-1 rounded-full animate-bounce">
            {alertCount} {isRTL ? 'تنبيه' : 'ALERT'}
          </span>
        )}
      </div>
      <h3 className={`font-black text-[11px] uppercase tracking-tight text-slate-900 ${isRTL ? 'w-full text-right' : ''}`}>
        {t(agent.id)}
      </h3>
      <p className={`text-[9px] font-bold uppercase tracking-widest ${isAttention ? 'text-red-600' : 'text-slate-400'} ${isRTL ? 'w-full text-right' : ''}`}>
        {isAttention ? t('urgent') : t('active_monitoring')}
      </p>
    </button>
  );
};

interface AgentWidgetsProps {
  alerts: AgentAlert[];
  onAgentClick: (agentId: string) => void;
}

export const AgentWidgets: React.FC<AgentWidgetsProps> = ({ alerts, onAgentClick }) => {
  return (
    <div className="grid grid-cols-2 gap-4 px-6">
      {AGENTS.map((agent) => {
        const agentAlerts = alerts.filter(a => a.agentId === agent.id);
        const status = agentAlerts.length > 0 ? AgentStatus.ATTENTION : AgentStatus.CLEAR;
        
        return (
          <AgentWidget 
            key={agent.id} 
            agent={agent} 
            status={status}
            alertCount={agentAlerts.length}
            onClick={() => onAgentClick(agent.id)}
          />
        );
      })}
    </div>
  );
};
