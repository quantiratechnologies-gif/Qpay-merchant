import React, { useState, useEffect, useRef } from 'react';
import { X, Flashlight, Image as ImageIcon, CheckCircle, Zap, Store, Coffee, Train } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { designSystem } from '../design-system';

export const ScanScreen: React.FC = () => {
  const { isScanModalOpen, setIsScanModalOpen, contacts, navigateTo, t, language } = useApp();
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isFlashOn, setIsFlashOn] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [scanSuccessContact, setScanSuccessContact] = useState<any | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Play scanner confirmation beep using Web Audio API
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch {
      // Audio context might be restricted before interaction
    }
  };

  // Start real camera stream
  useEffect(() => {
    if (!isScanModalOpen) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      return;
    }

    let isMounted = true;
    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          if (isMounted) setHasCameraPermission(false);
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        });

        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        setHasCameraPermission(true);
      } catch {
        if (isMounted) setHasCameraPermission(false);
      }
    };

    startCamera();

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [isScanModalOpen]);

  // Toggle Torch/Flashlight
  const toggleFlash = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track) {
      const capabilities = (track.getCapabilities ? track.getCapabilities() : {}) as any;
      if (capabilities.torch) {
        try {
          const nextState = !isFlashOn;
          await (track as any).applyConstraints({ advanced: [{ torch: nextState }] });
          setIsFlashOn(nextState);
        } catch {
          // Torch not supported on this device
        }
      } else {
        setIsFlashOn(!isFlashOn);
      }
    }
  };

  // Trigger successful scan transition
  const handleScanSuccess = (contact: any, amount?: number) => {
    setIsScanning(false);
    setScanSuccessContact(contact);
    playBeep();
    if (navigator.vibrate) {
      try {
        navigator.vibrate([40, 60, 40]);
      } catch {}
    }

    setTimeout(() => {
      setIsScanModalOpen(false);
      setIsScanning(true);
      setScanSuccessContact(null);
      navigateTo('SEND_AMOUNT', { contact, defaultAmount: amount });
    }, 600);
  };

  // Image upload gallery handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate instant decoding of selected QR image
    const selectedContact = contacts[0] || {
      id: 'merchant-qr-1',
      name: 'Star Supermarket',
      upiId: 'starsupermarket@sarie',
      avatarInitials: 'SS',
    };
    handleScanSuccess(selectedContact, 350);
  };

  if (!isScanModalOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="QR Code Payment Scanner"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#0B0B14',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: designSystem.typography.fontFamily,
      }}
    >
      {/* Hidden file input for gallery upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />

      {/* Top Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          zIndex: 20,
          background: 'linear-gradient(to bottom, rgba(11, 11, 20, 0.95), transparent)',
        }}
      >
        <button
          onClick={() => setIsScanModalOpen(false)}
          aria-label={t('btn.close', 'Close Scanner')}
          style={{
            backgroundColor: '#1E1E32',
            border: '1px solid #2C2C44',
            color: '#FFFFFF',
            width: '40px',
            height: '40px',
            borderRadius: designSystem.radii.full,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '800', margin: 0 }}>
            {t('scan.title', 'Scan QR Code')}
          </h2>
          <span style={{ fontSize: '11px', color: '#A2A2BA', fontWeight: '600' }}>
            {language === 'العربية' ? 'دفع فوري عبر شبكة سريع' : 'Instant Payment'}
          </span>
        </div>

        <button
          onClick={toggleFlash}
          aria-label="Toggle Flashlight"
          style={{
            backgroundColor: isFlashOn ? '#7FE87F' : '#1E1E32',
            border: '1px solid #2C2C44',
            color: isFlashOn ? '#0B0B14' : '#FFFFFF',
            width: '40px',
            height: '40px',
            borderRadius: designSystem.radii.full,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
        >
          <Flashlight size={18} />
        </button>
      </div>

      {/* Viewfinder Center Camera Area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          padding: '0 20px',
        }}
      >
        {/* Real Live Camera Stream View */}
        {hasCameraPermission && (
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 1,
            }}
          />
        )}

        {/* Viewfinder Target Box with Corner Reticles */}
        <div
          style={{
            width: '270px',
            height: '270px',
            borderRadius: '20px',
            position: 'relative',
            zIndex: 10,
            boxShadow: '0 0 0 4000px rgba(15, 15, 26, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            border: scanSuccessContact
              ? '3px solid #7FE87F'
              : '1.5px solid rgba(127, 232, 127, 0.35)',
            transition: 'border 0.3s ease',
          }}
        >
          {/* Corner Guides (QTPay Emerald Green) */}
          <div
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              width: 32,
              height: 32,
              borderTop: '4px solid #7FE87F',
              borderLeft: '4px solid #7FE87F',
              borderTopLeftRadius: '10px',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              width: 32,
              height: 32,
              borderTop: '4px solid #7FE87F',
              borderRight: '4px solid #7FE87F',
              borderTopRightRadius: '10px',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 10,
              left: 10,
              width: 32,
              height: 32,
              borderBottom: '4px solid #7FE87F',
              borderLeft: '4px solid #7FE87F',
              borderBottomLeftRadius: '10px',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 10,
              right: 10,
              width: 32,
              height: 32,
              borderBottom: '4px solid #7FE87F',
              borderRight: '4px solid #7FE87F',
              borderBottomRightRadius: '10px',
            }}
          />

          {/* Animated Laser Scanning Beam */}
          {isScanning && (
            <div
              className="scanner-laser"
              style={{
                width: '100%',
                height: '2px',
                backgroundColor: '#7FE87F',
                position: 'absolute',
                boxShadow: '0 0 12px #7FE87F, 0 0 4px #ffffff',
                animation: 'scanLaser 2.2s infinite ease-in-out alternate',
              }}
            />
          )}

          {/* Scan Success Overlay */}
          {scanSuccessContact && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(127, 232, 127, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                backdropFilter: 'blur(4px)',
              }}
            >
              <CheckCircle size={48} color="#7FE87F" />
              <span style={{ color: '#FFFFFF', fontWeight: '700', fontSize: '15px' }}>
                {language === 'العربية' ? 'تم التحقق من الرمز بنجاح!' : 'QR Verified!'}
              </span>
            </div>
          )}
        </div>

        {/* Status Guide Text */}
        <p
          style={{
            color: '#FFFFFF',
            fontSize: '12.5px',
            marginTop: '20px',
            fontWeight: '600',
            zIndex: 10,
            textAlign: 'center',
            backgroundColor: 'rgba(21, 21, 36, 0.9)',
            border: '1px solid #2C2C44',
            padding: '6px 16px',
            borderRadius: '20px',
            boxShadow: 'none',
          }}
        >
          {hasCameraPermission === false
            ? language === 'العربية' ? 'الكاميرا غير متاحة، اختر متجر تجريبي:' : 'Camera unavailable. Tap demo merchant:'
            : t('scan.align_qr', 'Point at any QR code to pay')}
        </p>

        {/* Quick Sample Merchant Presets for Instant Demo Scanning */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginTop: '12px',
            zIndex: 10,
            overflowX: 'auto',
            maxWidth: '100%',
            padding: '4px',
          }}
        >
          <button
            onClick={() =>
              handleScanSuccess(
                { id: 'm-1', name: 'Star Supermarket', upiId: 'star@sarie', avatarInitials: 'SS' },
                280
              )
            }
            style={{
              backgroundColor: '#151524',
              border: '1px solid #2C2C44',
              borderRadius: designSystem.radii.sm,
              padding: '6px 12px',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: 'none',
            }}
          >
            <Store size={13} color="#7FE87F" /> {language === 'العربية' ? 'أسواق بنده' : 'Star Supermarket'}
          </button>

          <button
            onClick={() =>
              handleScanSuccess(
                { id: 'm-2', name: 'Half Million Coffee', upiId: 'halfmillion@sarie', avatarInitials: 'HM' },
                180
              )
            }
            style={{
              backgroundColor: '#151524',
              border: '1px solid #2C2C44',
              borderRadius: designSystem.radii.sm,
              padding: '6px 12px',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: 'none',
            }}
          >
            <Coffee size={13} color="#7FE87F" /> {language === 'العربية' ? 'هاف مليون كافيه' : 'Half Million Coffee'}
          </button>

          <button
            onClick={() =>
              handleScanSuccess(
                { id: 'm-3', name: 'SEC Electricity', upiId: 'sec@sarie', avatarInitials: 'SEC' },
                100
              )
            }
            style={{
              backgroundColor: '#151524',
              border: '1px solid #2C2C44',
              borderRadius: designSystem.radii.sm,
              padding: '6px 12px',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: 'none',
            }}
          >
            <Train size={13} color="#7FE87F" /> {language === 'العربية' ? 'فاتورة الكهرباء' : 'SEC Electricity'}
          </button>
        </div>
      </div>

      {/* Bottom Actions Bar */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          padding: '20px',
          background: 'linear-gradient(to top, rgba(11, 11, 20, 0.95), transparent)',
          zIndex: 20,
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              backgroundColor: '#151524',
              border: '1px solid #2C2C44',
              borderRadius: designSystem.radii.md,
              padding: '12px',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: 'none',
            }}
          >
            <ImageIcon size={16} color="#7FE87F" /> {t('scan.upload_gallery', 'Upload QR')}
          </button>

          <button
            onClick={() => handleScanSuccess(contacts[0] || { name: 'Tariq Al-Otaibi', upiId: 'tariq@sarie' })}
            style={{
              backgroundColor: '#7FE87F',
              border: 'none',
              borderRadius: designSystem.radii.md,
              padding: '12px',
              color: '#0B0B14',
              fontSize: '13px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: 'none',
            }}
          >
            <Zap size={16} color="#0B0B14" /> {language === 'العربية' ? 'دفع تجريبي' : 'Demo Pay'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scanLaser {
          0% { top: 6%; }
          100% { top: 94%; }
        }
      `}</style>
    </div>
  );
};
