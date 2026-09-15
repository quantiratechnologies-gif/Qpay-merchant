import React, { useState } from 'react';
import { Send, X, Shield, CheckCheck } from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { useApp } from '../state/AppContext';
import { translateText } from '../utils/i18n';

interface ChatThread {
  id: string;
  name: string;
  avatarInitials: string;
  isSupport?: boolean;
  messages: { sender: 'me' | 'them'; text: string; time: string }[];
  time: string;
  unread: boolean;
}

export const MessagesScreen: React.FC = () => {
  const { language, isRtl } = useApp();
  const isAr = language === 'العربية' || language === 'ar';
  const [threads, setThreads] = useState<ChatThread[]>([
    {
      id: 'chat-1',
      name: isAr ? 'فريق دعم كيو تي باي' : 'QTPay Priority Support',
      avatarInitials: 'QT',
      isSupport: true,
      time: isAr ? '١٠:٤٢ ص' : '10:42 AM',
      unread: true,
      messages: [
        {
          sender: 'them',
          text: isAr ? 'مرحباً بك! أهلاً بك في دعم كيو تي باي المباشر.' : 'Hello! Welcome to QTPay Priority Support.',
          time: isAr ? '١٠:٤٠ ص' : '10:40 AM',
        },
        {
          sender: 'them',
          text: isAr ? 'تم دفع فاتورة الكهرباء بمبلغ ٢,٦٢٠.١٤ ر.س بنجاح لدى الشركة السعودية للكهرباء (SEC). رقم المرجع: SARIE94820184' : 'Your electricity bill payment of SAR 2,620.14 was credited successfully to Saudi Electricity Company (SEC). Ref: SARIE94820184',
          time: isAr ? '١٠:٤٢ ص' : '10:42 AM',
        },
      ],
    },
    {
      id: 'chat-2',
      name: isAr ? 'إشعارات مصرف الراجحي الرسمية' : 'Al Rajhi Bank Official',
      avatarInitials: 'AR',
      isSupport: true,
      time: isAr ? '١٠:٤١ ص' : '10:41 AM',
      unread: false,
      messages: [
        {
          sender: 'them',
          text: isAr ? 'تنبيه مصرف الراجحي: تم خصم مبلغ ٢,٦٢٠.١٤ ر.س من حسابكم SA03 •••• 4821 عبر سريع. البيان: دفع فاتورة SEC.' : 'Al Rajhi Bank Alert: A/c SA03 •••• 4821 debited by SAR 2,620.14 on 10-Sep-26 via Sarie. Info: SEC Utility Payment.',
          time: isAr ? '١٠:٤١ ص' : '10:41 AM',
        },
      ],
    },
    {
      id: 'chat-3',
      name: isAr ? 'طارق العتيبي' : 'Tariq Al-Otaibi',
      avatarInitials: 'TO',
      time: isAr ? 'أمس' : 'Yesterday',
      unread: false,
      messages: [
        {
          sender: 'me',
          text: isAr ? 'تم تحويل ٥٠٠ ر.س لقسمة العشاء!' : 'Sent SAR 500 for our dinner split!',
          time: isAr ? 'أمس ٨:٣٠ م' : 'Yesterday 8:30 PM',
        },
        {
          sender: 'them',
          text: isAr ? 'شكراً لك على التحويل الفوري عبر سريع! وصل المبلغ.' : 'Thanks for the instant Sarie transfer! Received.',
          time: isAr ? 'أمس ٨:٣٢ م' : 'Yesterday 8:32 PM',
        },
      ],
    },
  ]);

  const [activeChat, setActiveChat] = useState<ChatThread | null>(null);
  const [inputText, setInputText] = useState('');

  const handleOpenChat = (thread: ChatThread) => {
    setActiveChat(thread);
    // Mark as read
    setThreads((prev) =>
      prev.map((t) => (t.id === thread.id ? { ...t, unread: false } : t))
    );
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChat) return;

    const newMsg = {
      sender: 'me' as const,
      text: inputText.trim(),
      time: isAr ? 'الآن' : 'Just now',
    };

    const updatedMessages = [...activeChat.messages, newMsg];
    setActiveChat({ ...activeChat, messages: updatedMessages });

    setThreads((prev) =>
      prev.map((t) => (t.id === activeChat.id ? { ...t, messages: updatedMessages, time: isAr ? 'الآن' : 'Just now' } : t))
    );

    setInputText('');

    // Simulated Auto-Reply if Support
    if (activeChat.isSupport) {
      setTimeout(() => {
        const replyMsg = {
          sender: 'them' as const,
          text: isAr ? 'شكراً لتواصلك معنا. يقوم أحد أخصائيي الدعم بمراجعة طلبك حالياً.' : 'Thank you for reaching out. A customer support specialist is reviewing your inquiry.',
          time: isAr ? 'الآن' : 'Just now',
        };
        setActiveChat((curr) => (curr && curr.id === activeChat.id ? { ...curr, messages: [...curr.messages, replyMsg] } : curr));
      }, 1000);
    }
  };

  return (
    <div className="fade-in" style={{ backgroundColor: '#0B0B14', minHeight: '100%', paddingBottom: '96px', color: '#FFFFFF' }}>
      <AppHeader title={translateText('Messages & Alerts', language)} showBack showSettings={false} />

      <div style={{ padding: '20px' }}>
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#B3B3C2', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px', marginInlineStart: '4px' }}>
          {translateText('Conversations & System Alerts', language)}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {threads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => handleOpenChat(thread)}
              className="interactive-tap"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                backgroundColor: '#2A2A3E',
                border: thread.unread ? '1.5px solid #7FE87F' : '1px solid #4D4D6B',
                borderRadius: '16px',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: thread.isSupport ? '#1A1A2E' : '#3A3A52',
                    color: '#7FE87F',
                    border: '1px solid #4D4D6B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '14px',
                    flexShrink: 0,
                  }}
                >
                  {thread.avatarInitials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: 800, fontSize: '15px', color: '#FFFFFF' }}>{thread.name}</span>
                    {thread.isSupport && <Shield size={14} color="#7FE87F" />}
                  </div>
                  <div style={{ fontSize: '12px', color: '#B3B3C2', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {thread.messages[thread.messages.length - 1]?.text}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: thread.unread ? '#7FE87F' : '#808099', marginInlineStart: '10px' }}>
                {thread.time}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Interactive Chat Modal Window */}
      {activeChat && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 15, 26, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
          onClick={() => setActiveChat(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '440px',
              height: '85vh',
              backgroundColor: '#1A1A2E',
              borderTop: '1px solid #4D4D6B',
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Chat Window Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderBottom: '1px solid #4D4D6B',
                backgroundColor: '#2A2A3E',
                color: '#FFFFFF',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#1A1A2E',
                    color: '#7FE87F',
                    border: '1px solid #4D4D6B',
                    fontWeight: 800,
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {activeChat.avatarInitials}
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF' }}>{activeChat.name}</div>
                  <div style={{ fontSize: '11px', color: '#7FE87F' }}>{translateText('Online • QTPay Messaging', language)}</div>
                </div>
              </div>
              <button
                onClick={() => setActiveChat(null)}
                aria-label="Close"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#3A3A52',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#B3B3C2',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#1A1A2E' }}>
              {activeChat.messages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: msg.sender === 'me' ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    backgroundColor: msg.sender === 'me' ? '#7FE87F' : '#2A2A3E',
                    color: msg.sender === 'me' ? '#000000' : '#FFFFFF',
                    padding: '12px 16px',
                    borderRadius: msg.sender === 'me'
                      ? isRtl ? '16px 2px 16px 16px' : '16px 16px 2px 16px'
                      : isRtl ? '2px 16px 16px 16px' : '16px 16px 16px 2px',
                    border: msg.sender === 'me' ? 'none' : '1px solid #4D4D6B',
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 600, lineHeight: '1.45' }}>{msg.text}</div>
                  <div
                    style={{
                      fontSize: '10px',
                      color: msg.sender === 'me' ? 'rgba(0, 0, 0, 0.7)' : '#808099',
                      textAlign: isRtl ? 'left' : 'right',
                      marginTop: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: isRtl ? 'flex-start' : 'flex-end',
                      gap: '4px',
                    }}
                  >
                    {msg.time}
                    {msg.sender === 'me' && <CheckCheck size={12} />}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Send Input Box */}
            <form onSubmit={handleSendMessage} style={{ padding: '12px 16px', borderTop: '1px solid #4D4D6B', backgroundColor: '#2A2A3E', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={translateText('Type a message...', language)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '20px',
                  border: '1.5px solid #4D4D6B',
                  backgroundColor: '#1A1A2E',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                className="interactive-tap"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: '#7FE87F',
                  border: 'none',
                  color: '#000000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transform: isRtl ? 'scaleX(-1)' : 'none',
                }}
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

