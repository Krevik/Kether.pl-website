declare module '*.module.css';

// Global type declarations
declare global {
    interface Window {
        // Add any global window properties here if needed
    }
}

// Module declarations for static assets
declare module '*.png' {
    const content: string;
    export default content;
}

declare module '*.jpg' {
    const content: string;
    export default content;
}

declare module '*.jpeg' {
    const content: string;
    export default content;
}

declare module '*.svg' {
    const content: string;
    export default content;
}

declare module '*.gif' {
    const content: string;
    export default content;
}

declare module '*.ico' {
    const content: string;
    export default content;
}

declare module '*.json' {
    const content: any;
    export default content;
}
