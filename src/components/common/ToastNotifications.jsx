import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastNotifications = () => {
  const { notifications } = useApp();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {notifications.map((n) => (
        <div
          key={n.id}
          className="pointer-events-auto flex items-center justify-between gap-3 p-3.5 bg-[#111111] text-white rounded-lg shadow-lg border border-neutral-800 text-sm animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="flex items-center gap-2.5">
            {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {n.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {n.type === 'info' && <Info className="w-4 h-4 text-sky-400 shrink-0" />}
            <span className="font-medium text-neutral-200">{n.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
