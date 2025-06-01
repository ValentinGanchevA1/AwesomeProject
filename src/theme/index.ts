export const theme = {
colors: {
    primary: '#007AFF',
secondary: '#FF3B30',
background: '#FFFFFF',
surface: '#F2F2F7',
text: '#000000',
textSecondary: '#8E8E93',
border: '#C6C6C8',
error: '#FF3B30',
success: '#34C759',
warning: '#FF9500',
},
spacing: {
xs: 4,
sm: 8,
md: 16,
lg: 24,
xl: 32,
},
typography: {
h1: {
fontSize: 32,
fontWeight: 'bold',
},
h2: {
fontSize: 24,
fontWeight: '600',
},
body: {
fontSize: 16,
fontWeight: 'normal',
},
caption: {
fontSize: 12,
fontWeight: 'normal',
},
},
};

export type Theme = typeof theme;