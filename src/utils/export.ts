import { toPng } from 'html-to-image';

export async function exportAsImage(element: HTMLElement, filename = 'meal-sketch.png') {
  const dataUrl = await toPng(element, {
    backgroundColor: '#EDE8D0',
    style: {
      padding: '24px',
    },
  });
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

export function downloadJson(data: string, filename = 'meal-sketch.json') {
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}

export function importJsonFile(): Promise<string> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return reject('No file selected');
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject('Failed to read file');
      reader.readAsText(file);
    };
    input.click();
  });
}
