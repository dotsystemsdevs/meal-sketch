import { useState } from 'react';
import { Share2, Trash2 } from 'lucide-react';

type Props = {
  boardRef: React.RefObject<HTMLDivElement | null>;
  clearWeek: () => void;
};

export function Header({ boardRef, clearWeek }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleShare = async () => {
    if (!boardRef.current) return;

    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(boardRef.current, {
        backgroundColor: '#EDE8D0',
        style: { padding: '24px' },
      });

      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], 'meal-sketch.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Meal Sketch',
          files: [file],
        });
      } else {
        const link = document.createElement('a');
        link.download = 'meal-sketch.png';
        link.href = dataUrl;
        link.click();
      }
    } catch { /* user cancelled share */ }
  };

  return (
    <>
      <header className="header">
        <h1>Meal Sketch</h1>
        <div className="header-actions">
          <button className="btn-icon" onClick={handleShare} title="Share">
            <Share2 size={17} />
          </button>
          <button className="btn-icon" onClick={() => setShowConfirm(true)} title="Clear week">
            <Trash2 size={17} />
          </button>
        </div>
      </header>

      {showConfirm && (
        <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Clear week?</h3>
            <p className="confirm-text">
              This will remove all meals from the weekly plan.
            </p>
            <div className="confirm-actions">
              <button className="btn-danger" onClick={() => { clearWeek(); setShowConfirm(false); }}>
                Clear
              </button>
              <button className="btn-cancel" onClick={() => setShowConfirm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
