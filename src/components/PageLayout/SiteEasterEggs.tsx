import { useEffect } from 'react';
import { notificationManager } from '../../utils/notificationManager';

const KONAMI_CODES = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'KeyB',
    'KeyA',
] as const;

function isTypingTarget(target: EventTarget | null): boolean {
    if (!target || !(target instanceof HTMLElement)) return false;
    return Boolean(
        target.closest('input, textarea, select, [contenteditable="true"], [role="textbox"]')
    );
}

/**
 * Lightweight site-wide secrets: Konami, PL meme buffer, footer rapid clicks.
 * No UI — only classes + toasts.
 */
export function SiteEasterEggs() {
    useEffect(() => {
        let konamiIndex = 0;
        let typingBuffer = '';
        const footerClickTimes: number[] = [];

        const onKeyDown = (event: KeyboardEvent) => {
            if (isTypingTarget(event.target)) return;

            if (event.code === KONAMI_CODES[konamiIndex]) {
                konamiIndex += 1;
                if (konamiIndex === KONAMI_CODES.length) {
                    konamiIndex = 0;
                    document.documentElement.classList.add('kether-konami');
                    window.setTimeout(() => {
                        document.documentElement.classList.remove('kether-konami');
                    }, 10000);
                    notificationManager.SUCCESS('Tryb prestiżu: aktywny przez chwilę. Pozdro!');
                }
            } else {
                konamiIndex = event.code === KONAMI_CODES[0] ? 1 : 0;
            }

            if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
                typingBuffer = (typingBuffer + event.key).slice(-8);
                if (typingBuffer.endsWith('2137')) {
                    typingBuffer = '';
                    notificationManager.SUCCESS('313 → 2137. Legenda.');
                }
            }
        };

        const onDocumentClick = (event: MouseEvent) => {
            const el = event.target;
            if (!(el instanceof Element)) return;
            if (!el.closest('.footer-copyright')) return;

            const now = Date.now();
            const recent = footerClickTimes.filter((t) => now - t < 750);
            recent.push(now);
            footerClickTimes.length = 0;
            footerClickTimes.push(...recent);

            if (footerClickTimes.length >= 5) {
                footerClickTimes.length = 0;
                notificationManager.SUCCESS('Pięć szybkich klików w stopce — szacun.');
            }
        };

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('click', onDocumentClick);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('click', onDocumentClick);
        };
    }, []);

    return null;
}
