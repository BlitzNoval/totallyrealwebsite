// ============================================
// 📚 DATA COLLECTIONS FOR ANEZWORLD 📚
// ============================================

const DATA = {
    // Collections - Each collection represents a category of memories
    // Categories: birthdays, special-days, adventure-days
    collections: [
        {
            id: 'valentines-2025',
            title: "Valentine's Day 2025",
            icon: '',
            description: 'The day love was confirmed',
            date: '2025-02-14',
            category: 'special-days',
            link: 'valentine.html',
            items: null // Can add specific items if needed
        },
        {
            id: '22nd-birthday',
            title: "22nd Birthday",
            icon: '',
            description: 'A special celebration',
            date: '2025-10-27',
            category: 'birthdays',
            link: 'birthday.html',
            items: null
        },
        {
            id: 'coming-soon',
            title: "More Coming Soon",
            icon: '',
            description: 'New adventures await...',
            date: null,
            link: null,
            isPlaceholder: true,
            items: null
        }
        // Add more collections here following this format:
        // {
        //     id: 'unique-id',
        //     title: 'Collection Name',
        //     icon: '📸',
        //     description: 'A brief description',
        //     date: '2025-01-15', // Optional
        //     link: 'collection-page.html', // Optional - makes card clickable
        //     items: [ // Optional - array of items in this collection
        //         { title: 'Item 1', url: '...' },
        //         { title: 'Item 2', url: '...' }
        //     ]
        // },
        //
        // Example collections you might add:
        // {
        //     id: 'memories-2024',
        //     title: 'Memories 2024',
        //     icon: '📸',
        //     description: 'Photos and videos from our adventures',
        //     items: []
        // },
        // {
        //     id: 'love-letters',
        //     title: 'Letters',
        //     icon: '💌',
        //     description: 'Written messages and notes',
        //     items: []
        // },
        // {
        //     id: 'special-projects',
        //     title: 'Projects',
        //     icon: '🎨',
        //     description: 'Things created with love',
        //     items: []
        // }
    ]
};

// Export to window
window.DATA = DATA;
