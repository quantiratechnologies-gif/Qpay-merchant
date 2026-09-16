import React, { useState } from 'react';
import { HelpCircle, MessageSquare, PhoneCall, ChevronDown, ChevronUp, Send, Check, ShieldAlert } from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { ListRow } from '../components/ListRow';
import { Modal } from '../components/Modal';

export const HelpSupportScreen: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'chat' | 'call' | 'dispute' | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'agent'; text: string; time: string }>>([
    { sender: 'agent', text: 'Hello! How can I assist you with your QTPay account today?', time: 'Just now' },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [disputeSuccess, setDisputeSuccess] = useState(false);
  const [disputeTxnId, setDisputeTxnId] = useState('');
  const [disputeReason, setDisputeReason] = useState('');

  const faqs = [
    { q: 'How long does a Sarie refund take?', a: 'Instant Sarie refunds are usually credited within seconds to 1-2 hours. In rare bank network delays, it can take up to 24 hours.' },
    { q: 'What is the daily Sarie transfer limit?', a: 'The standard daily Sarie instant transaction limit is SAR 50,000 across digital banking apps.' },
    { q: 'How do I add a new Saudi bank account?', a: 'Go to Profile > Bank Accounts > tap Add Bank, select your Saudi bank, and verify your mobile number via SMS.' },
  ];

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg;
    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: userText, time: 'Just now' },
    ]);
    setInputMsg('');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'agent', text: `Thank you for reaching out regarding "${userText}". Our customer support team is reviewing your inquiry and will respond shortly.`, time: 'Just now' },
      ]);
    }, 1000);
  };

  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDisputeSuccess(true);
    setTimeout(() => {
      setDisputeSuccess(false);
      setActiveModal(null);
      setDisputeTxnId('');
      setDisputeReason('');
    }, 1500);
  };

  return (
    <div className="fade-in" style={{ backgroundColor: '#080C14', minHeight: '100%', paddingBottom: '36px', color: '#FFFFFF' }}>
      <AppHeader title="Help & Support" showBack showSettings={false} />

      <div style={{ padding: '20px' }}>
        {/* Priority Hero Banner */}
        <div
          style={{
            backgroundColor: '#111726',
            border: '1.5px solid rgba(0, 200, 83, 0.35)',
            borderRadius: '16px',
            padding: '24px 20px',
            marginBottom: '22px',
            textAlign: 'center',
            color: '#FFFFFF',
            boxShadow: 'none',
          }}
        >
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              backgroundColor: 'rgba(0, 200, 83, 0.12)',
              color: '#00C853',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
              border: '1px solid rgba(0, 200, 83, 0.3)',
            }}
          >
            <HelpCircle size={28} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px', color: '#FFFFFF', margin: 0 }}>
            24/7 Support
          </h3>
          <p style={{ fontSize: '12.5px', color: '#94A3B8', marginTop: '6px', marginBottom: 0 }}>
            Instant dispute resolution and assistance
          </p>
        </div>

        <div style={{ fontSize: '12px', fontWeight: 500, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', marginLeft: '4px' }}>
          Contact Channels
        </div>

        <div style={{ backgroundColor: '#111726', border: '1px solid #1E293B', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px', boxShadow: 'none' }}>
          <ListRow
            icon={<MessageSquare size={18} color="#00C853" />}
            label="Live Chat"
            subLabel="Avg response: ~1 min"
            onClick={() => setActiveModal('chat')}
          />
          <div style={{ height: '1px', backgroundColor: '#1E293B', margin: '0 16px' }} />
          <ListRow
            icon={<PhoneCall size={18} color="#00C853" />}
            label="Toll-Free Hotline"
            subLabel="800-123-QTPAY"
            onClick={() => setActiveModal('call')}
          />
          <div style={{ height: '1px', backgroundColor: '#1E293B', margin: '0 16px' }} />
          <ListRow
            icon={<ShieldAlert size={18} color="#00C853" />}
            label="Dispute & Fraud"
            subLabel="File a transaction complaint"
            onClick={() => setActiveModal('dispute')}
          />
        </div>

        {/* FAQs */}
        <div style={{ fontSize: '12px', fontWeight: 500, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px', marginLeft: '4px' }}>
          Frequently Asked Questions
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {faqs.map((faq, index) => {
            const isExpanded = expandedFaq === index;
            return (
              <div
                key={index}
                className="interactive-tap"
                style={{
                  backgroundColor: '#111726',
                  border: '1px solid #1E293B',
                  borderRadius: '16px',
                  padding: '16px 18px',
                  cursor: 'pointer',
                  boxShadow: 'none',
                }}
                onClick={() => setExpandedFaq(isExpanded ? null : index)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#FFFFFF' }}>{faq.q}</span>
                  {isExpanded ? <ChevronUp size={16} color="#00C853" /> : <ChevronDown size={16} color="#94A3B8" />}
                </div>
                {isExpanded && (
                  <p style={{ fontSize: '12.5px', color: '#94A3B8', marginTop: '10px', marginBottom: 0, lineHeight: '1.5', borderTop: '1px solid #1E293B', paddingTop: '10px' }}>
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Chat Modal */}
      <Modal isOpen={activeModal === 'chat'} onClose={() => setActiveModal(null)} title="Live Support">
        <div style={{ height: '260px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px', paddingRight: '4px' }}>
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.sender === 'user' ? '#00C853' : '#1A2234',
                color: msg.sender === 'user' ? '#080C14' : '#FFFFFF',
                border: msg.sender === 'user' ? 'none' : '1px solid #1E293B',
                padding: '10px 14px',
                borderRadius: '14px',
                maxWidth: '80%',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="Type your message..."
            style={{ flex: 1, padding: '12px 14px', borderRadius: '12px', border: '1px solid #1E293B', backgroundColor: '#1A2234', color: '#FFFFFF', fontSize: '13px', outline: 'none' }}
          />
          <button
            type="submit"
            className="interactive-tap"
            style={{ backgroundColor: '#00C853', border: 'none', color: '#080C14', padding: '0 16px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', boxShadow: 'none' }}
          >
            <Send size={16} />
          </button>
        </form>
      </Modal>

      {/* Hotline Call Modal */}
      <Modal isOpen={activeModal === 'call'} onClose={() => setActiveModal(null)} title="Toll-Free Hotline">
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              backgroundColor: 'rgba(0, 200, 83, 0.12)',
              color: '#00C853',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px auto',
              border: '1.5px solid rgba(0, 200, 83, 0.3)',
            }}
          >
            <PhoneCall size={28} />
          </div>
          <h4 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 6px 0' }}>800-123-QTPAY</h4>
          <p style={{ fontSize: '12.5px', color: '#94A3B8', margin: '0 0 20px 0' }}>Available 24x7 in Arabic and English (Toll-Free in KSA)</p>
          <a
            href="tel:80012378729"
            className="interactive-tap"
            style={{ display: 'inline-block', padding: '12px 28px', backgroundColor: '#00C853', color: '#080C14', borderRadius: '14px', fontWeight: 800, fontSize: '14px', textDecoration: 'none', boxShadow: '0 4px 16px rgba(0, 200, 83, 0.35)' }}
          >
            Call Now
          </a>
        </div>
      </Modal>

      {/* Report Dispute Modal */}
      <Modal isOpen={activeModal === 'dispute'} onClose={() => setActiveModal(null)} title="Report Dispute">
        {disputeSuccess ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 200, 83, 0.12)',
                color: '#00C853',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto',
              }}
            >
              <Check size={28} />
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF' }}>Dispute Filed</h4>
            <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>Ticket #AP-DISP-{Math.floor(100000 + Math.random() * 900000)}</p>
          </div>
        ) : (
          <form onSubmit={handleDisputeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 500, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
                Transaction UTR
              </label>
              <input
                type="text"
                value={disputeTxnId}
                onChange={(e) => setDisputeTxnId(e.target.value)}
                placeholder="e.g. UTR984729104821"
                required
                style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid #1E293B', backgroundColor: '#1A2234', color: '#FFFFFF', fontSize: '13px', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 500, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
                Dispute Reason
              </label>
              <textarea
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                placeholder="Describe what went wrong..."
                rows={3}
                required
                style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid #1E293B', backgroundColor: '#1A2234', color: '#FFFFFF', fontSize: '13px', outline: 'none', resize: 'none', fontFamily: 'inherit' }}
              />
            </div>

            <button
              type="submit"
              className="interactive-tap"
              style={{
                marginTop: '8px',
                padding: '14px',
                borderRadius: '14px',
                backgroundColor: '#00C853',
                color: '#080C14',
                border: 'none',
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(0, 200, 83, 0.35)',
              }}
            >
              Submit Dispute
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
};
