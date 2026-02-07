
import React, { useState, useRef, useEffect } from 'react';
import { Layout } from './components/Layout';
import { AgentWidgets } from './components/AgentWidgets';
import { Chatbot } from './components/Chatbot';
import { LanguageProvider, useTranslation } from './context/LanguageContext';
import { MOCK_FAMILY, AGENTS } from './constants';
import { FamilyMember, AgentAlert } from './types';
import { getAgentReasoning } from './services/geminiService';

const MainApp: React.FC = () => {
  const { t, isRTL } = useTranslation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [family] = useState<FamilyMember[]>(MOCK_FAMILY);
  const [alerts, setAlerts] = useState<AgentAlert[]>([
    {
      id: 'a1',
      agentId: 'residency',
      title: 'VISA EXPIRY IMMINENT',
      description: 'Mary Poppins\' visa expires in 5 days (June 1st).',
      deadline: '2025-06-01',
      priority: 'high',
      status: 'pending',
      explanation: 'As a domestic worker, a visa lapse leads to immediate fines.',
      source: 'crustdata',
      memberId: '4'
    },
    {
      id: 'a2',
      agentId: 'compliance',
      title: 'RTA TRAFFIC FINE',
      description: 'New speeding violation detected on Sheikh Zayed Road. AED 600.',
      priority: 'medium',
      status: 'pending',
      explanation: 'Unpaid fines block car registration renewal.',
      source: 'crustdata'
    }
  ]);

  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isLoadingReasoning, setIsLoadingReasoning] = useState(false);
  const [activeWorkflow, setActiveWorkflow] = useState<'renewal' | 'rta' | null>(null);
  const [workflowStep, setWorkflowStep] = useState(0);

  const startWorkflow = (type: 'renewal' | 'rta') => {
    setActiveWorkflow(type);
    setWorkflowStep(1);
    const intervals = [2000, 4500, 7000, 9500];
    intervals.forEach((time, idx) => {
      setTimeout(() => setWorkflowStep(idx + 2), time);
    });
  };

  const handleAgentClick = async (agentId: string) => {
    setSelectedAgentId(agentId);
    const agent = AGENTS.find(a => a.id === agentId);
    const agentAlerts = alerts.filter(a => a.agentId === agentId);
    
    if (agentAlerts.length > 0) {
      setIsLoadingReasoning(true);
      try {
        const reasoning = await getAgentReasoning(agent?.name || 'Agent', agentAlerts[0].description, family);
        setAiExplanation(reasoning || null);
      } catch (e) {
        setAiExplanation("Trace failed.");
      } finally {
        setIsLoadingReasoning(false);
      }
    }
  };

  const selectedAgent = AGENTS.find(a => a.id === selectedAgentId);

  return (
    <Layout>
      <div className="p-6 pt-10 space-y-12 pb-20">
        <section>
          <div className={`mb-6 px-1 ${isRTL ? 'text-right' : 'text-left'}`}>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{t('dashboard')}</h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">{t('family_govt')}</p>
          </div>
          <AgentWidgets alerts={alerts} onAgentClick={handleAgentClick} />
        </section>

        <section>
          <h3 className={`font-black text-[12px] text-slate-900 uppercase tracking-tight mb-4 px-1 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('critical_tasks')}
          </h3>
          <div className="space-y-6">
            {alerts.map(alert => (
              <div key={alert.id} className="p-6 rounded-[2.5rem] border-2 border-slate-100 bg-white shadow-xl shadow-slate-100/30">
                <div className={`flex justify-between items-start mb-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-xl">
                    {alert.agentId === 'residency' ? '🛂' : '🚔'}
                  </div>
                  <span className="text-[9px] px-3 py-1 bg-red-600 text-white rounded-full font-black uppercase tracking-widest">{t('urgent')}</span>
                </div>
                <h4 className={`font-black text-lg text-slate-900 uppercase tracking-tight mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{alert.title}</h4>
                <p className={`text-[11px] text-slate-500 mb-6 font-medium leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>{alert.description}</p>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => startWorkflow(alert.agentId === 'residency' ? 'renewal' : 'rta')}
                    className="w-full py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-slate-200 active:scale-[0.98] transition-all"
                  >
                    {alert.agentId === 'residency' ? t('renew_visa') : t('pay_fines')}
                  </button>
                  <button 
                    onClick={() => handleAgentClick(alert.agentId)}
                    className="w-full py-3 border-2 border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl"
                  >
                    {t('trace')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className={`fixed bottom-10 z-40 ${isRTL ? 'left-8' : 'right-8'}`}>
        <button 
          onClick={() => setIsChatOpen(true)}
          className="w-16 h-16 bg-slate-900 text-white rounded-[1.8rem] shadow-2xl flex items-center justify-center font-black text-[10px] uppercase tracking-tighter hover:bg-emerald-600 transition-colors"
        >
          {isRTL ? 'حياة' : 'HAYAT'}
        </button>
      </div>

      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} alerts={alerts} family={family} />

      {/* WORKFLOW MODAL */}
      {activeWorkflow && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col max-w-md mx-auto animate-in slide-in-from-bottom duration-500 overflow-hidden">
           <header className="p-6 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white z-10">
             <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
               <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center text-xs animate-pulse">🤖</div>
               <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-400">HAYAT Autonomous Agent</h3>
             </div>
             {workflowStep >= 5 && (
               <button onClick={() => setActiveWorkflow(null)} className="text-[10px] font-black uppercase text-slate-900 border-2 border-slate-900 px-4 py-1.5 rounded-full">{t('close')}</button>
             )}
          </header>

          <div className="flex-1 overflow-y-auto p-10 space-y-12">
             <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-4xl mx-auto shadow-inner border border-slate-100">
                  {activeWorkflow === 'renewal' ? '👩' : '🧾'}
                </div>
                <div>
                   <h4 className="font-black text-2xl uppercase tracking-tighter text-slate-900">
                     {activeWorkflow === 'renewal' ? 'Mary Poppins' : 'RTA Fine S-9922'}
                   </h4>
                   <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">
                     {activeWorkflow === 'renewal' ? 'Visa Residency Automation' : 'Digital Compliance Payment'}
                   </p>
                </div>
             </div>

             <div className="space-y-8">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className={`flex gap-6 items-start transition-all duration-700 ${workflowStep >= step ? 'opacity-100' : 'opacity-10'}`}>
                    <div className={`w-8 h-8 rounded-2xl flex items-center justify-center text-[11px] font-black shrink-0 ${workflowStep > step ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'bg-slate-900 text-white'}`}>
                      {workflowStep > step ? '✓' : step}
                    </div>
                    <div className="flex-1">
                      <h5 className="text-[11px] font-black uppercase text-slate-900 mb-1">
                        {step === 1 ? t('data_retrieval') : step === 2 ? t('form_filling') : step === 3 ? t('compliance_check') : activeWorkflow === 'renewal' ? t('gdrfa_sub') : t('rta_sub')}
                      </h5>
                      <p className="text-[10px] text-slate-500 font-medium">
                        {workflowStep === step ? t('processing') : workflowStep > step ? t('submitted') : 'Awaiting start...'}
                      </p>
                      {step === 2 && workflowStep >= 2 && (
                        <div className="mt-4 p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 space-y-2 font-mono text-[9px] text-slate-600">
                           <div className="flex justify-between"><span>ID:</span> <span className="font-black">784-1992-0099887-4</span></div>
                           <div className="flex justify-between"><span>TYPE:</span> <span className="font-black">RESIDENCE_VISA</span></div>
                           <div className="flex justify-between"><span>STATUS:</span> <span className="font-black text-emerald-600">AUTO_FETCHED</span></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="p-10 border-t border-slate-50 bg-white">
            {workflowStep < 5 ? (
              <div className="flex flex-col items-center gap-4">
                 <div className="flex gap-1">
                   <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce"></div>
                   <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:200ms]"></div>
                   <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:400ms]"></div>
                 </div>
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t('processing')}</p>
              </div>
            ) : (
              <button 
                onClick={() => setActiveWorkflow(null)}
                className="w-full py-5 bg-emerald-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-[1.8rem] shadow-2xl shadow-emerald-100 active:scale-[0.98] transition-all"
              >
                {t('back')}
              </button>
            )}
          </div>
        </div>
      )}

      {selectedAgentId && selectedAgent && !activeWorkflow && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col max-w-md mx-auto animate-in slide-in-from-bottom duration-300">
          <header className="p-6 border-b border-slate-50 flex items-center bg-white text-slate-900 sticky top-0">
            <button onClick={() => setSelectedAgentId(null)} className="flex items-center gap-2 text-[10px] font-black uppercase border-2 border-slate-900 px-4 py-2 rounded-2xl mr-4">
              {t('back')}
            </button>
            <h3 className="font-black text-sm uppercase flex-1">{t(selectedAgent.id)}</h3>
          </header>
          <div className="flex-1 overflow-y-auto p-8 space-y-10">
            <div className={`flex items-center gap-5 border-b border-slate-50 pb-8 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center text-4xl shadow-inner border border-slate-50">
                {selectedAgent.icon}
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h3 className="font-black text-2xl uppercase tracking-tighter text-slate-900 leading-none">{t(selectedAgent.id)}</h3>
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-[0.2em] mt-2">{t('active_monitoring')}</p>
              </div>
            </div>
            <div className={`text-xs text-slate-700 leading-relaxed bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
              {isLoadingReasoning ? t('processing') : (aiExplanation || "System Trace Nominal.")}
            </div>
            <div className="space-y-4">
              {selectedAgent.services.map(service => (
                <div key={service.id} className="p-5 rounded-3xl border border-slate-100 bg-white shadow-sm">
                  <div className={`flex items-center justify-between mb-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className="text-[11px] font-black uppercase text-slate-900">{service.name}</span>
                    <span className={`w-2 h-2 rounded-full ${service.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                  </div>
                  <p className={`text-[10px] text-slate-500 font-medium ${isRTL ? 'text-right' : 'text-left'}`}>{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
};

export default App;
