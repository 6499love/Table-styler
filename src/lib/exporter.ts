import { toPng, toSvg } from 'html-to-image';

export async function exportTableAsPNG(element: HTMLElement, scale = 2) {
  try {
    const dataUrl = await toPng(element, {
      pixelRatio: scale,
      backgroundColor: '#0c0c0e', // Match the dark theme background or make it transparent
      style: {
        margin: '0',
      }
    });
    
    const link = document.createElement('a');
    link.download = 'table.png';
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error('Failed to export PNG', err);
  }
}

export async function exportTableAsSVG(element: HTMLElement) {
  try {
    const dataUrl = await toSvg(element, {
      backgroundColor: '#0c0c0e',
    });
    
    const link = document.createElement('a');
    link.download = 'table.svg';
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error('Failed to export SVG', err);
  }
}
