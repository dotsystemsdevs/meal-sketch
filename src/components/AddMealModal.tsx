import { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

type Props = {
  onAdd: (name: string, portions: number) => void;
  onClose: () => void;
};

export function AddMealModal({ onAdd, onClose }: Props) {
  const [name, setName] = useState('');
  const [portions, setPortions] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && portions > 0) {
      onAdd(name.trim(), portions);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={18} /></button>
        <h3>New Meal</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Name
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Lasagna"
              autoFocus
            />
          </label>
          <label>
            Portions
            <div className="stepper">
              <button type="button" className="stepper-btn" onClick={() => setPortions(p => Math.max(1, p - 1))} disabled={portions <= 1}>
                <ChevronDown size={18} />
              </button>
              <span className="stepper-value">{portions}</span>
              <button type="button" className="stepper-btn" onClick={() => setPortions(p => p + 1)}>
                <ChevronUp size={18} />
              </button>
            </div>
          </label>
          <button type="submit" className="btn-primary">Add</button>
        </form>
      </div>
    </div>
  );
}
