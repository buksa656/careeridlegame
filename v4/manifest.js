 // Embedded PWA Manifest
        if ('serviceWorker' in navigator) {
            const manifestData = {
                "name": "CorpoClicker Phase 4.3",
                "short_name": "CorpoClicker",
                "description": "Advanced Corporate Clicker Game - Global Empire Edition",
                "start_url": "./",
                "display": "standalone",
                "background_color": "#21808d",
                "theme_color": "#21808d",
                "orientation": "portrait-primary",
                "icons": [
                    {
                        "src": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%2321808d'/%3E%3Ctext x='50' y='60' text-anchor='middle' fill='white' font-size='40'%3E🏦%3C/text%3E%3C/svg%3E",
                        "sizes": "192x192",
                        "type": "image/svg+xml"
                    }
                ]
            };

            const manifestBlob = new Blob([JSON.stringify(manifestData)], {type: 'application/json'});
            const manifestURL = URL.createObjectURL(manifestBlob);

            const link = document.createElement('link');
            link.rel = 'manifest';
            link.href = manifestURL;
            document.head.appendChild(link);
        }